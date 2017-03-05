<?php

namespace ZfcUser\Service;

use Zend\Authentication\AuthenticationService;
use Zend\Form\Form;
use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;
use Zend\Crypt\Password\Bcrypt;
use Zend\Stdlib\Hydrator;
use Zend\Db\Sql\Expression;
use ZfcBase\EventManager\EventProvider;
use ZfcUser\Entity\User as UserEntity;
use ZfcUser\Mapper\User as UserMapper;
use ZfcUser\Options\UserServiceOptionsInterface;
use Application\Helper\AppConfig;

class User extends EventProvider implements ServiceManagerAwareInterface
{
    public function register(array $data, $role = 'parent')
    {
        $class = $this->getOptions()->getUserEntityClass();
        $user  = new $class;
        $form  = $this->getRegisterForm();
        $form->setHydrator($this->getFormHydrator());
        $form->bind($user);
        $form->setData($data);
        
        if (!$form->isValid()) return false;

        $user = $form->getData();
        
        $now = new Expression('NOW()');
        $bcrypt = new Bcrypt;
        $bcrypt->setCost($this->getOptions()->getPasswordCost());
        $user->setPassword($bcrypt->create($user->getPassword()));
        
        $user->setLatitude(AppConfig::USER_DEFAULT_LATITUDE);
        $user->setLongitude(AppConfig::USER_DEFAULT_LONGITUDE);
        $user->setDateAdded($now);
        $user->setDateModified($now);

        // If user state is enabled, set the default state value
        if ($this->getOptions()->getEnableUserState()) {
            $user->setState($this->getOptions()->getDefaultUserState());
        }
        
        $this->getEventManager()->trigger(__FUNCTION__, $this, array('user' => $user, 'form' => $form));
        $this->getUserMapper()->insert($user);
        $this->getEventManager()->trigger(__FUNCTION__.'.post', $this, array('user' => $user, 'form' => $form));
        
        return $user;
    }

    public function changePassword(array $data)
    {
        $currentUser = $this->getAuthService()->getIdentity();

        $oldPass = $data['credential'];
        $newPass = $data['newCredential'];

        $bcrypt = new Bcrypt;
        $bcrypt->setCost($this->getOptions()->getPasswordCost());

        if (!$bcrypt->verify($oldPass, $currentUser->getPassword())) {
            return false;
        }

        $pass = $bcrypt->create($newPass);
        $currentUser->setPassword($pass);

        $this->getEventManager()->trigger(__FUNCTION__, $this, array('user' => $currentUser, 'data' => $data));
        $this->getUserMapper()->update($currentUser);
        $this->getEventManager()->trigger(__FUNCTION__.'.post', $this, array('user' => $currentUser, 'data' => $data));

        return true;
    }

    public function changeEmail(array $data)
    {
        $currentUser = $this->getAuthService()->getIdentity();

        $bcrypt = new Bcrypt;
        $bcrypt->setCost($this->getOptions()->getPasswordCost());

        if (!$bcrypt->verify($data['credential'], $currentUser->getPassword())) {
            return false;
        }

        $currentUser->setEmail($data['newIdentity']);

        $this->getEventManager()->trigger(__FUNCTION__, $this, array('user' => $currentUser, 'data' => $data));
        $this->getUserMapper()->update($currentUser);
        $this->getEventManager()->trigger(__FUNCTION__.'.post', $this, array('user' => $currentUser, 'data' => $data));

        return true;
    }
    
    public function updateProfile(array $data)
    {
        $currentUser = $this->getAuthService()->getIdentity();
        
    	$form = $this->getUpdateUserForm();
    	$form->setHydrator($this->getFormHydrator());
    	$form->bind($currentUser);
    	$form->setData($data);

        if (!$form->isValid()) {
    		return [
    			'status' => 'error',
    			'msg' => $form->getMessages()
			];
        }

        $currentUser = $form->getData();
        $currentUser->setDateModified(new Expression('NOW()'));
        $this->getUserMapper()->update($currentUser);
        
        return ['status' => 'success'];
    }
    
    public function getUpdateCurrentUserForm()
    {
        $currentUser = $this->getAuthService()->getIdentity();
        $form = $this->getUpdateUserForm();
        $form->setHydrator($this->getFormHydrator());
        $form->bind($currentUser);
        
        return $form;
    }
    
    protected function fromTimeStamp($timestamp)
    {
    	$diff = time() - $timestamp;
    	if ($diff <= 0) {
    		return 'Just Now';
    	} elseif ($diff < 60) {
    		return $this->grammarDate(floor($diff), ' second(s) ago');
    	} elseif ($diff < 60 * 60) {
    		return $this->grammarDate(floor($diff / 60), ' minute(s) ago');
    	} elseif ($diff < 60 * 60 * 24) {
    		return $this->grammarDate(floor($diff / (60 * 60)), ' hour(s) ago');
    	} elseif ($diff < 60 * 60 * 24 * 30) {
    		return $this->grammarDate(floor($diff / (60 * 60 * 24)), ' day(s) ago');
    	} elseif ($diff < 60 * 60 * 24 * 30 * 12) {
    		return $this->grammarDate(floor($diff / (60 * 60 * 24 * 30)), ' month(s) ago');
    	} else {
    		return $this->grammarDate(floor($diff / (60 * 60 * 24 * 30 * 12)), ' year(s) ago');
    	}
    }
    
    protected function fromDateTime($dateTime)
    {
    	if ($this->getView()->showTimeAgo === true) {
    		$dateTimeObject = new \DateTime($dateTime);
    		return $this->fromTimeStamp($dateTimeObject->getTimestamp());
    	} else {
    		return $dateTime;
    	}
    }
    
    protected function grammarDate($val, $sentence)
    {
    	if ($val > 1) {
    		return $val.str_replace('(s)', 's', $sentence);
    	} else {
    		return $val.str_replace('(s)', '', $sentence);
    	}
    }
         
    private function getAvatarImageUrl($avatar = null, $size = '32')
    {
        $path = AppConfig::USER_AVATAR_FOLDER . '/' . $avatar;
        
        if($avatar && file_exists($path)) {
            $thumb = $this->getAppService()->getServerUrlHelper()->__invoke($path);
        } else {
            $thumb = $this->getAppService()->getServerUrlHelper()->__invoke(sprintf('/img/no-avatar-%d.jpg', $size));
        }
    
        return $thumb;
    }
    
    private function getAgeFromBirthday($birthday = null) 
    {
        $age = false;
        if($birthday) {
            $tz  = new \DateTimeZone('Asia/Ho_Chi_Minh');
            $b = \DateTime::createFromFormat('d/m/Y', date('d/m/Y', strtotime($birthday)), $tz);
            if($b) {
                $age = $b->diff(new \DateTime('now', $tz))->y;
            }
        }
        return $age;
    }
    
    protected $userMapper;
    
    protected $formHydrator;
    protected $loginForm;
    protected $registerForm;
    
    protected $updateUserForm;
    protected $changePasswordForm;
    
    protected $appService;
    protected $authService;    
    protected $serviceManager;
    protected $options;  
     
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
    
    public function getUpdateUserForm()
    {
        if($this->updateUserForm === null) {
            $this->updateUserForm = $this->getServiceManager()->get('zfcuser_update_user_form');
        }
        return $this->updateUserForm;
    }
    
    public function setUpdateUserForm(\ZfcUser\Form\UpdateUser $form)
    {
        $this->updateUserForm = $form;
        return $this;
    }
    
    public function getAppService()
    {
        if (null === $this->appService) {
            $this->appService = $this->getServiceManager()->get('app_app_service');
        }
        return $this->appService;
    }
    
    public function setAppService(\Application\Service\App $appService)
    {
        $this->appService = $appService;
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
   
    public function getRegisterForm()
    {
        if (null === $this->registerForm) {
            $this->registerForm = $this->getServiceManager()->get('zfcuser_register_form');
        }
        return $this->registerForm;
    }
   
    public function setRegisterForm(Form $registerForm)
    {
        $this->registerForm = $registerForm;
        return $this;
    }
   
    public function getChangePasswordForm()
    {
        if (null === $this->changePasswordForm) {
            $this->changePasswordForm = $this->getServiceManager()->get('zfcuser_change_password_form');
        }
        return $this->changePasswordForm;
    }
    
    public function setChangePasswordForm(Form $changePasswordForm)
    {
        $this->changePasswordForm = $changePasswordForm;
        return $this;
    }
  
    public function getOptions()
    {
        if (!$this->options instanceof UserServiceOptionsInterface) {
            $this->setOptions($this->getServiceManager()->get('zfcuser_module_options'));
        }
        return $this->options;
    }
    
    public function setOptions(UserServiceOptionsInterface $options)
    {
        $this->options = $options;
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
    
    public function getFormHydrator()
    {
        if (!$this->formHydrator instanceof Hydrator\HydratorInterface) {
            $this->setFormHydrator($this->getServiceManager()->get('zfcuser_register_form_hydrator'));
        }

        return $this->formHydrator;
    }
 
    public function setFormHydrator(Hydrator\HydratorInterface $formHydrator)
    {
        $this->formHydrator = $formHydrator;
        return $this;
    }
}
