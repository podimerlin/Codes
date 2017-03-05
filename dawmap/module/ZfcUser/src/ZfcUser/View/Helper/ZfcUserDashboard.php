<?php

namespace ZfcUser\View\Helper;

use Zend\View\Helper\AbstractHelper;
use Zend\View\Model\ViewModel;
use Application\Service\App as AppService;

class ZfcUserDashboard extends AbstractHelper
{
	protected $appService;
	protected $viewTemplate = 'zfc-user/helper/dashboard';
	
    public function __invoke()
    {       
    	$user = $this->getAppService()->getCurrentUserInfo();
    	
    	if(!$user) return false;
    	
    	$form = $this->getAppService()->getUpdateUserDescriptionForm();
    	$form->get('description')->setValue($user['description']);
    	
        $vm = new ViewModel();
        $vm->setVariables([
            'user' => $user,
            'form' => $form
        ]);
        $vm->setTemplate($this->viewTemplate);
        return $this->getView()->render($vm);
    }
    
    public function getAppService()
    {
        return $this->appService;
    }
    
    public function setAppService(AppService $appService)
    {
        $this->appService = $appService;
        return $this;
    }
}
