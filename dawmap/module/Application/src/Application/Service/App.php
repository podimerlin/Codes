<?php

namespace Application\Service;

use Zend\Authentication\AuthenticationService;
use Zend\Form\Form;
use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;
use Zend\Crypt\Password\Bcrypt;
use Zend\Stdlib\Hydrator;
use Zend\Db\Sql\Expression;
use ZfcBase\EventManager\EventProvider;
use ZfcUser\Mapper\UserInterface as UserMapperInterface;
use ZfcUser\Options\UserServiceOptionsInterface;
use ZfcUser\Mapper\User as UserMapper;
use Application\Helper\AppConfig;
use Application\Entity\Tag as TagEntity;

class App extends EventProvider implements ServiceManagerAwareInterface
{
    public function getPublicMarkers($query = array())
    {
        $where = [];
        // sql injection will be fixed later
        if(isset($query['name']) && !empty($query['name'])) {
            if(isset($query['type']) && $query['type']=='hashtag') {
                $where['u.hashtag'] = [
                    'operator' => 'LIKE',
                    'value' => $query['name']
                ];
            } elseif(isset($query['type']) && $query['type']=='keyword') {
                $where['u.description'] = [
                    'operator' => 'LIKE',
                    'value' => $query['name']
                ];
            }
        }
        
        $results = $this->getUserMapper()->getUsers([
            'where' => $where
        ]);
        
        $data = [];
        foreach($results as $result) {
            if(!empty($result['latitude']) && !empty($result['longitude'])) {
                $data[] = [
                    'id' => $result['id'],
                    'type' => 'public',
                    'lat' => $result['latitude'],
                    'lng' => $result['longitude'],
                    'thumb' => $this->getUserThumb($result['avatar'], 128),
                    'displayName' => $result['display_name'],
                    'email' => $result['email'],
                    'description' => nl2br($result['description']),
                    'hashtags' => !empty($result['hashtag']) ? explode(',', $result['hashtag']) : array()
                ];
            }
        }
        
        return $data;
    }
    
    public function getUserInfoByUserId($id)
    {
        $user = $this->getUserMapper()->findById($id);
        
        if(!$user) return;
        
        if($user->getHashtag()) {
            $hashtags = explode(',', $user->getHashtag());
        } else {
            $hashtags = array();
        }
        
        return [
            'id' => $user->getId(),
            'type' => 'user',
            'lat' => $user->getLatitude() ? $user->getLatitude() : AppConfig::USER_DEFAULT_LATITUDE,
            'lng' => $user->getLongitude() ? $user->getLongitude() : AppConfig::USER_DEFAULT_LONGITUDE,
            'thumb' => $this->getUserThumb($user->getAvatar(), 256),
            'displayName' => $user->getDisplayName(),
            'email' => $user->getEmail(),
            'description' => $user->getDescription(),
            'hashtags' => $hashtags,
        ];
    }
    
    public function getCurrentUserInfo()
    {
        $currentUser = $this->getAuthService()->getIdentity();
        
        if(!$currentUser) return false;
        
        return [
            'id' => $currentUser->getId(),
            'type' => 'user',
            'lat' => $currentUser->getLatitude() ? $currentUser->getLatitude() : AppConfig::USER_DEFAULT_LATITUDE,
            'lng' => $currentUser->getLongitude() ? $currentUser->getLongitude() : AppConfig::USER_DEFAULT_LONGITUDE,
            'thumb' => $this->getUserThumb($currentUser->getAvatar(), 256),
            'displayName' => $currentUser->getDisplayName(),
            'email' => $currentUser->getEmail(),
            'description' => $currentUser->getDescription(),
            'hashtags' => $currentUser->getHashtag() ? explode(',', $currentUser->getHashtag()) : array(),
        ];
    }
    
    public function updateCurrentUserPosition(array $data)
    {
        $currentUser = $this->getAuthService()->getIdentity();
        
        if(!$currentUser || !isset($data['lat']) || !isset($data['lng'])) return false;

        $currentUser->setLatitude(floatval($data['lat']));
        $currentUser->setLongitude(floatval($data['lng']));
            
        $this->getUserMapper()->update($currentUser);
        
        return true;
    }
    
    public function updateCurrentUserDescription(array $post)
    {
        $currentUser = $this->getAuthService()->getIdentity();
        
        if(!$currentUser) return false;
        
        $oldTags = !empty($currentUser->getHashtag()) ? explode(',', $currentUser->getHashtag()) : array();
        
        $form = $this->getUpdateUserDescriptionForm();
        $form->setData($post);
        
        if(!$form->isValid()) return false;
        
        $data = $form->getData();
        $description = $data['description'];
        $hashtagStr = $this->getHashtagsStringFromText($description);
        
        $currentUser->setDescription($description);
        $currentUser->setHashtag($hashtagStr);
        $currentUser->setDateModified(new Expression('NOW()'));
        $this->getUserMapper()->update($currentUser);
        
        $newTags = !empty($hashtagStr) ? explode(',', $hashtagStr) : array();
        
        $this->updateTagsFromDatabase($oldTags, $newTags);
        
        return $newTags;
    }
    
    public function updateTagsFromDatabase(array $oldTags, array $newTags)
    {
        $hasChanged = false;
        foreach($oldTags as $tag) {
            if(!in_array($tag, $newTags)) {
                $entity = $this->getTagMapper()->findByName($tag);
                
                if(!$entity) {
                    $entity = new TagEntity;
                    $entity->setName($tag);
                    $entity->setTotal(1);
                    $this->getTagMapper()->insert($entity);
                }
                
                $entity->setTotal(intval($entity->getTotal())-1);
                $this->getTagMapper()->update($entity);
                $hasChanged = true;
            }
        }
        
        foreach($newTags as $tag) {
            if(!in_array($tag, $oldTags)) {
                $entity = $this->getTagMapper()->findByName($tag);
                
                if(!$entity) {
                    $entity = new TagEntity;
                    $entity->setName($tag);
                    $entity->setTotal(0);
                    $this->getTagMapper()->insert($entity);
                }
                
                $entity->setTotal(intval($entity->getTotal())+1);
                $this->getTagMapper()->update($entity);
                $hasChanged = true;
            }
        }
        
        if($hasChanged) $this->updateTagsFromCache();
        
        return;
    }
    
    public function updateAllTagsFromDatabase()
    {
        $results = $this->getUserMapper()->getUsers();
        
        $hashtags = [];
        foreach($results as $result) {
            $tags = !empty($result['hashtag']) ? explode(',', $result['hashtag']) : array();
            foreach($tags as $tag) {
                if(isset($hashtags[$tag])) {
                    $hashtags[$tag]+=1;
                } else {
                    $hashtags[$tag] = 1;
                }
            }
        }
        
        foreach($hashtags as $name=>$total) {
            $entity = $this->getTagMapper()->findByName($name);
            
            if(!$entity) {
                $entity = new TagEntity;
                $entity->setName($name);
                $entity->setTotal(0);
                $this->getTagMapper()->insert($entity);
            }
            
            $entity->setTotal($total);
            $this->getTagMapper()->update($entity);
        }
        return;
    }
    
    public function updateTagsFromCache()
    {
        $cache = $this->getCacheService();
        $key = 'cache-db-tags';
        
        $results = $this->getTagMapper()->fetchBy([
            'where' => [
                'total' => [
                    'operator' => '>',
                    'value' => 0
                ]
            ]
        ]);
        
        $data = [];
        foreach($results as $result) {
            $data[] = [
                'id' => $result['id'],
                'name' => $result['name'],
                'total' => $result['total']
            ];
        }
        $cache->setItem($key, $data);
        
        return;
    }
    
    public function getTagsFromCache()
    {
        $cache = $this->getCacheService();
        $key = 'cache-db-tags';
        
        $success = false;
        $data = $cache->getItem($key, $success);
        
        if(!$success) {
            $results = $this->getTagMapper()->fetchBy([
                'where' => [
                    'total' => [
                        'operator' => '>',
                        'value' => 0
                    ]
                ]
            ]);
            $data = [];
            foreach($results as $result) {
                $data[] = [
                    'id' => $result['id'],
                    'name' => $result['name'],
                    'total' => $result['total']
                ];
            }
            $cache->setItem($key, $data);
        }
        
        return $data;
    }
    
    private function getHashtagsStringFromText($text) 
    {
        $hashtags = $this->getHashtagsArrayFromText($text);
        
        $hashtagStr = '';
        foreach($hashtags as $hashtag) {
            $hashtagStr .= $hashtag.',';
        }
        return rtrim($hashtagStr, ',');
    }
    
    public function getHashtagsArrayFromText($text)
    {
        preg_match_all('/(^|[^a-z0-9_])#([a-z0-9_]+)/i', $text, $matchedHashtags);
        $hashtags = [];
        if(!empty($matchedHashtags[0])) {
            foreach($matchedHashtags[0] as $match) {
                array_push($hashtags, preg_replace("/[^a-z0-9]+/i", "", $match));
            }
        }
        return array_unique($hashtags);
    }
    
    private function convertToClickableLinks($text)
    {
        $parsedMessage = preg_replace(array('/(?i)\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?«»“”‘’]))/', '/(^|[^a-z0-9_])@([a-z0-9_]+)/i', '/(^|[^a-z0-9_])#([a-z0-9_]+)/i'), array('<a href="$1" target="_blank">$1</a>', '$1<a href="">@$2</a>', '$1<a href="index.php?hashtag=$2">#$2</a>'), $text);
        return $parsedMessage;
    }
    
    private function getUserThumb($avatar = null, $size = '32')
    {
        if($avatar && file_exists(getcwd() . '/public/uploads/avatar/' . $avatar)) {
            $thumb = $this->getServerUrlHelper()->__invoke('/uploads/avatar/' . $avatar);
        } else {
            $thumb = $this->getServerUrlHelper()->__invoke(sprintf('/assets/img/no-avatar-%s.jpg', $size));
        }
    
        return $thumb;
    }

    private function getAgeFromBirthday($birthday = null)
    {
        $age = '';
        if($birthday) {
            $tz  = new \DateTimeZone('Asia/Ho_Chi_Minh');
            $datetime = \DateTime::createFromFormat('d/m/Y', date('d/m/Y', strtotime($birthday)), $tz);
            $age = ($datetime) ? $datetime->diff(new \DateTime('now', $tz))->y : '';
        }
        return $age;
    }

    protected $userMapper;
    protected $tagMapper;
    protected $updateUserDescriptionForm;
    
    protected $userService;
    protected $authService;
    protected $cacheService;
    protected $serviceManager;
    protected $serverUrlHelper;
    protected $urlHelper;
    protected $viewRenderer;
    
    public function getUserMapper()
    {
        if (null === $this->userMapper) {
            $this->userMapper = $this->getServiceManager()->get('zfcuser_user_mapper');
        }
        return $this->userMapper;
    }
    
    public function setUserMapper(UserMapper $userMapper)
    {
        $this->userMapper = $userMapper;
        return $this;
    }
    
    public function getTagMapper()
    {
        if (null === $this->tagMapper) {
            $this->tagMapper = $this->getServiceManager()->get('app_tag_mapper');
        }
        return $this->tagMapper;
    }
    
    public function setTagMapper(\Application\Mapper\Tag $mapper)
    {
        $this->tagMapper = $mapper;
        return $this;
    }
    
    public function getUpdateUserDescriptionForm()
    {
        if (null === $this->updateUserDescriptionForm) {
            $this->updateUserDescriptionForm = $this->getServiceManager()->get('app_update_user_description_form');
        }
        return $this->updateUserDescriptionForm;
    }
    
    public function setUpdateUserDescriptionForm(Form $form)
    {
        $this->updateUserDescriptionForm = $form;
        return $this;
    }
    
    public function getUserService()
    {
        if($this->userService === null) {
            $this->userService = $this->getServiceManager()->get('zfcuser_user_service');
        }
        return $this->userService;
    }
     
    public function setUserService(\ZfcUser\Service\User $service)
    {
        $this->userService = $service;
        return $this;
    }
    
    public function getAuthService()
    {
        if (null === $this->authService) {
            $this->authService = $this->getServiceManager()->get('zfcuser_auth_service');
        }
        return $this->authService;
    }
    
    public function setAuthService(AuthenticationService $authService)
    {
        $this->authService = $authService;
        return $this;
    }
    
    public function getCacheService()
    {
        if (null === $this->cacheService) {
            $this->cacheService = $this->getServiceManager()->get('cache');
        }
        return $this->cacheService;
    }
    
    public function setCacheService(\Zend\Cache\Storage\Adapter\Filesystem $service)
    {
        $this->cacheService = $service;
        return $this;
    }
    
    public function getServiceManager()
    {
        return $this->serviceManager;
    }
     
    public function setServiceManager(ServiceManager $serviceManager)
    {
        $this->serviceManager = $serviceManager;
        return $this;
    }
    
    public function getUrlHelper()
    {
        if($this->urlHelper == null) {
            $this->urlHelper = $this->getServiceManager()->get('ViewHelperManager')->get('url');
        }
        return $this->urlHelper;
    }
    
    public function setUrlHelper(\Zend\View\Helper\Url $urlHelper)
    {
        $this->urlHelper = $urlHelper;
        return $this;
    }
    
    public function getServerUrlHelper()
    {
        if($this->serverUrlHelper == null) {
            $this->serverUrlHelper = $this->getServiceManager()->get('ViewHelperManager')->get('ServerUrl');
        }
        return $this->serverUrlHelper;
    }
    
    public function setServerUrlHelper(\Zend\View\Helper\ServerUrl $serverUrlHelper)
    {
        $this->serverUrlHelper = $serverUrlHelper;
        return $this;
    }
    
    public function getViewRenderer()
    {
        if($this->viewRenderer == null) {
            $this->viewRenderer = $this->getServiceManager()->get('ViewRenderer');
        }
        return $this->viewRenderer;
    }
    
    public function setViewRenderer(\Zend\View\Renderer\PhpRenderer $viewRenderer)
    {
        $this->viewRenderer = $viewRenderer;
        return $this;
    }
    
    public function makeSlugs($string, $maxlen = 0, $noSpace = true, $source_langcode = null) {
        global $session;
        $newStringTab = array();
        $string = strtolower($this->_transliteration_process(trim(html_entity_decode($string, ENT_QUOTES, "UTF-8")), '-', $source_langcode));
        if (function_exists('str_split')) {
            $stringTab = str_split($string);
        } else {
            $stringTab = $this->my_str_split($string);
        }
        $numbers = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-");
        foreach ($stringTab as $letter) {
            if (in_array($letter, range("a", "z")) || in_array($letter, $numbers)) {
                $newStringTab[] = $letter;
            } elseif ($letter == " ") {
                if ($noSpace) {
                    $newStringTab[] = "-";
                } else {
                    $newStringTab[] = " ";
                }
            }
        }
        if (count($newStringTab)) {
            $newString = implode($newStringTab);
            if ($maxlen > 0) {
                $newString = substr($newString, 0, $maxlen);
            }
            $newString = $this->removeDuplicates('--', '-', $newString);
        } else {
            $newString = '';
        }
        return $newString;
    }
    
    /**
     * Transliterates UTF-8 encoded text to US-ASCII.
     *
     * Based on Mediawiki's UtfNormal::quickIsNFCVerify().
     *
     * @param $string
     *   UTF-8 encoded text input.
     * @param $unknown
     *   Replacement string for characters that do not have a suitable ASCII
     *   equivalent.
     * @param $source_langcode
     *   Optional ISO 639 language code that denotes the language of the input and
     *   is used to apply language-specific variations. If the source language is
     *   not known at the time of transliteration, it is recommended to set this
     *   argument to the site default language to produce consistent results.
     *   Otherwise the current display language will be used.
     * @return
     *   Transliterated text.
     */
    function _transliteration_process($string, $unknown = '?', $source_langcode = NULL) {
        // ASCII is always valid NFC! If we're only ever given plain ASCII, we can
        // avoid the overhead of initializing the decomposition tables by skipping
        // out early.
        if (!preg_match('/[\x80-\xff]/', $string)) {
            return $string;
        }
    
        static $tailBytes;
    
        if (!isset($tailBytes)) {
            // Each UTF-8 head byte is followed by a certain number of tail bytes.
            $tailBytes = array();
            for ($n = 0; $n < 256; $n++) {
                if ($n < 0xc0) {
                    $remaining = 0;
                } elseif ($n < 0xe0) {
                    $remaining = 1;
                } elseif ($n < 0xf0) {
                    $remaining = 2;
                } elseif ($n < 0xf8) {
                    $remaining = 3;
                } elseif ($n < 0xfc) {
                    $remaining = 4;
                } elseif ($n < 0xfe) {
                    $remaining = 5;
                } else {
                    $remaining = 0;
                }
                $tailBytes[chr($n)] = $remaining;
            }
        }
    
        // Chop the text into pure-ASCII and non-ASCII areas; large ASCII parts can
        // be handled much more quickly. Don't chop up Unicode areas for punctuation,
        // though, that wastes energy.
        preg_match_all('/[\x00-\x7f]+|[\x80-\xff][\x00-\x40\x5b-\x5f\x7b-\xff]*/', $string, $matches);
    
        $result = '';
        foreach ($matches[0] as $str) {
            if ($str[0] < "\x80") {
                // ASCII chunk: guaranteed to be valid UTF-8 and in normal form C, so
                // skip over it.
                $result .= $str;
                continue;
            }
    
            // We'll have to examine the chunk byte by byte to ensure that it consists
            // of valid UTF-8 sequences, and to see if any of them might not be
            // normalized.
            //
            // Since PHP is not the fastest language on earth, some of this code is a
            // little ugly with inner loop optimizations.
    
            $head = '';
            $chunk = strlen($str);
            // Counting down is faster. I'm *so* sorry.
            $len = $chunk + 1;
    
            for ($i = -1; --$len;) {
                $c = $str[++$i];
                if ($remaining = $tailBytes[$c]) {
                    // UTF-8 head byte!
                    $sequence = $head = $c;
                    do {
                        // Look for the defined number of tail bytes...
                        if (--$len && ($c = $str[++$i]) >= "\x80" && $c < "\xc0") {
                            // Legal tail bytes are nice.
                            $sequence .= $c;
                        } else {
                            if ($len == 0) {
                                // Premature end of string! Drop a replacement character into
                                // output to represent the invalid UTF-8 sequence.
                                $result .= $unknown;
                                break 2;
                            } else {
                                // Illegal tail byte; abandon the sequence.
                                $result .= $unknown;
                                // Back up and reprocess this byte; it may itself be a legal
                                // ASCII or UTF-8 sequence head.
                                --$i;
                                ++$len;
                                continue 2;
                            }
                        }
                    } while (--$remaining);
    
                    $n = ord($head);
                    if ($n <= 0xdf) {
                        $ord = ($n - 192) * 64 + (ord($sequence[1]) - 128);
                    } elseif ($n <= 0xef) {
                        $ord = ($n - 224) * 4096 + (ord($sequence[1]) - 128) * 64 + (ord($sequence[2]) - 128);
                    } elseif ($n <= 0xf7) {
                        $ord = ($n - 240) * 262144 + (ord($sequence[1]) - 128) * 4096 + (ord($sequence[2]) - 128) * 64 + (ord($sequence[3]) - 128);
                    } elseif ($n <= 0xfb) {
                        $ord = ($n - 248) * 16777216 + (ord($sequence[1]) - 128) * 262144 + (ord($sequence[2]) - 128) * 4096 + (ord($sequence[3]) - 128) * 64 + (ord($sequence[4]) - 128);
                    } elseif ($n <= 0xfd) {
                        $ord = ($n - 252) * 1073741824 + (ord($sequence[1]) - 128) * 16777216 + (ord($sequence[2]) - 128) * 262144 + (ord($sequence[3]) - 128) * 4096 + (ord($sequence[4]) - 128) * 64 + (ord($sequence[5]) - 128);
                    }
                    $result .= $this->_transliteration_replace($ord, $unknown, $source_langcode);
                    $head = '';
                } elseif ($c < "\x80") {
                    // ASCII byte.
                    $result .= $c;
                    $head = '';
                } elseif ($c < "\xc0") {
                    // Illegal tail bytes.
                    if ($head == '') {
                        $result .= $unknown;
                    }
                } else {
                    // Miscellaneous freaks.
                    $result .= $unknown;
                    $head = '';
                }
            }
        }
        return $result;
    }
    
    /**
     * Replaces a Unicode character using the transliteration database.
     *
     * @param $ord
     *   An ordinal Unicode character code.
     * @param $unknown
     *   Replacement string for characters that do not have a suitable ASCII
     *   equivalent.
     * @param $langcode
     *   Optional ISO 639 language code that denotes the language of the input and
     *   is used to apply language-specific variations.  Defaults to the current
     *   display language.
     * @return
     *   ASCII replacement character.
     */
    function _transliteration_replace($ord, $unknown = '?', $langcode = NULL) {
        static $map = array();
    
        $bank = $ord >> 8;
    
        if (!isset($map[$bank][$langcode])) {
            $file = getcwd() . '/data/seo_data/' . sprintf('x%02x', $bank) . '.php';
            if (file_exists($file)) {
                include $file;
                if ($langcode != 'en' && isset($variant[$langcode])) {
                    // Merge in language specific mappings.
                    $map[$bank][$langcode] = $variant[$langcode] + $base;
                } else {
                    $map[$bank][$langcode] = $base;
                }
            } else {
                $map[$bank][$langcode] = array();
            }
        }
    
        $ord = $ord & 255;
    
        return isset($map[$bank][$langcode][$ord]) ? $map[$bank][$langcode][$ord] : $unknown;
    }
    
    private function removeDuplicates($sSearch, $sReplace, $sSubject) {
        $i = 0;
        do {
            $sSubject = str_replace($sSearch, $sReplace, $sSubject);
            $pos = strpos($sSubject, $sSearch);
            $i++;
            if ($i > 100) {
                die('removeDuplicates() loop error');
            }
        } while ($pos !== false);
        return $sSubject;
    }
}
