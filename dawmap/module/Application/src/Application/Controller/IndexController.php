<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

use Zend\Debug\Debug;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        
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
