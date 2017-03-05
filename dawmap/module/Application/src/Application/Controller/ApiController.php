<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class ApiController extends AbstractActionController
{
    public function indexAction()
    {
        $currentUser = $this->getAppService()->getCurrentUserInfo();
        $markers = $this->getAppService()->getPublicMarkers();
        
        return new JsonModel([
            'markers' => $markers,
            'currentUser' => $currentUser,
        ]);
    }
    
    public function markersAction()
    {
        $query = $this->params()->fromQuery();
        $markers = $this->getAppService()->getPublicMarkers($query);
        
        return new JsonModel($markers);
    }
    
    public function infoAction()
    {
        $id = $this->params()->fromRoute('id', 0);
        
        $user = $this->getAppService()->getUserInfoByUserId($id);
        
        return new JsonModel($user);
    }
    
    public function autocompleteAction()
    {
        $query = $this->params()->fromQuery('q', '');
        
        $word = strtolower($query);
        
        $records = $this->getAppService()->getTagsFromCache();
        
        $matches = array_filter($records, function($value, $key) use ($word) {
            return preg_match("/$word/", strtolower($value['name']));
        }, ARRAY_FILTER_USE_BOTH);
        
        $data = [];
        foreach ($matches as $match) {
            array_push($data, [
                'id' => $match['id'],
                'name' => $match['name'],
                'total' => $match['total'],
                'type' => 'hashtag'
            ]);
        }
        return new JsonModel($data);
    }
    
    public function updatetagAction() {
        $this->getAppService()->updateAllTagsFromDatabase();
        
        return new JsonModel(array('status' => 'OK'));
    }
    
    public function testAction() 
    {
        $text = 'precious teeth #pick #floss #tooth #smooth #performance #serial #rocks #twitter #lorem #lorem';
        
        $hashtags = $this->getAppService()->getHashtagsArrayFromText($text);
        
        return new JsonModel($hashtags);
    }
    
    private function textHighlight($text, $search, $casesensitive = false)
    {
        $modifier = ($casesensitive) ? 'i' : '';
        $quotedSearch = preg_quote($search,'/');
        $checkPattern = '/'.$quotedSearch.'/'.$modifier;
        $strReplacement = '<strong>$0</strong>';
        return preg_replace($checkPattern, $strReplacement, $text);
    }
    
    protected $appService;
    
    public function getAppService()
    {
        if (!$this->appService) {
            $this->appService = $this->getServiceLocator()->get('app_app_service');
        }
        return $this->appService;
    }
    
    public function setAppService(\Application\Service\App $service)
    {
        $this->appService = $service;
        return $this;
    }
}
