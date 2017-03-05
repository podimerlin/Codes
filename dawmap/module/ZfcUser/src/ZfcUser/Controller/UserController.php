<?php

namespace ZfcUser\Controller;

use Zend\Form\Form;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Stdlib\ResponseInterface as Response;
use Zend\Stdlib\Parameters;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use ZfcUser\Service\User as UserService;
use ZfcUser\Options\UserControllerOptionsInterface;
use Application\Service\App as AppService;
use Application\Helper\AppConfig;

use Zend\Debug\Debug;

class UserController extends AbstractActionController
{
    const ROUTE_CHANGEPASSWD = 'zfcuser/changepassword';
    const ROUTE_LOGIN        = 'zfcuser/login';
    const ROUTE_REGISTER     = 'zfcuser/register';
    const ROUTE_REGISTER_TUTOR    = 'zfcuser/register-tutor';
    const ROUTE_CHANGEEMAIL  = 'zfcuser/changeemail';
    const ROUTE_CHANGE_AVATAR  = 'zfcuser/change-avatar';
    
    const ROUTE_USER = 'zfcuser';
    const ROUTE_USER_PARENT = 'zfcuser/parent';
    const ROUTE_USER_TUITION = 'zfcuser/tuition';
    const ROUTE_USER_TUTOR = 'zfcuser/tutor';

    const CONTROLLER_NAME    = 'zfcuser';

    protected $userService;
    protected $appService;
    protected $loginForm;
    protected $registerForm;
    protected $changePasswordForm;
    protected $changeEmailForm;
    protected $changeAvatarForm;

    protected $failedLoginMessage = 'Authentication failed. Please try again.';

    protected $options;

    protected $redirectCallback;

    public function __construct($redirectCallback)
    {
        if (!is_callable($redirectCallback)) {
            throw new \InvalidArgumentException('You must supply a callable redirectCallback');
        }
        $this->redirectCallback = $redirectCallback;
    }

    public function indexAction()
    {
        if (!$this->zfcUserAuthentication()->hasIdentity()) {
            return $this->redirect()->toRoute(static::ROUTE_LOGIN);
        }
        
        return $this->notFoundAction();
    }

    public function loginAction()
    {
    	if ($this->zfcUserAuthentication()->hasIdentity()) {
    		return $this->redirect()->toRoute($this->getOptions()->getLoginRedirectRoute());
    	}
    	
        $request = $this->getRequest();
        
        $form = $this->getLoginForm();

        if ($this->getOptions()->getUseRedirectParameterIfPresent() && $request->getQuery()->get('redirect')) {
            $redirect = $request->getQuery()->get('redirect');
        } else {
            $redirect = false;
        }

        if (!$request->isPost()) {
            return [
                'loginForm' => $form,
                'redirect'  => $redirect
            ];
        }
        
        $form->setData($request->getPost());
        
        if (!$form->isValid()) {
            $this->flashMessenger()->setNamespace('zfcuser-login-form')->addMessage($this->failedLoginMessage);
            return $this->redirect()->toUrl($this->url()->fromRoute('zfcuser/login').($redirect ? '?redirect='. rawurlencode($redirect) : ''));
        }
        
        $this->zfcUserAuthentication()->getAuthAdapter()->resetAdapters();
        $this->zfcUserAuthentication()->getAuthService()->clearIdentity();
        
        return $this->forward()->dispatch(static::CONTROLLER_NAME, array('action' => 'authenticate'));
    }
    
    public function loginAjaxAction()
    {
        $request = $this->getRequest();
        
        if(!$request->isPost() || !$request->isXmlHttpRequest() || $this->zfcUserAuthentication()->hasIdentity()) return $this->notFoundAction();
        
        $form = $this->getLoginForm();
        
        if ($this->getOptions()->getUseRedirectParameterIfPresent() && $request->getQuery()->get('redirect')) {
            $redirect = $request->getQuery()->get('redirect');
        } else {
            $redirect = false;
        }

        $form->setData($request->getPost());
        
        if (!$form->isValid()) {
            return new JsonModel([
                'status' => 'error',
                'msg' => $this->failedLoginMessage
            ]);
        }
        
        $this->zfcUserAuthentication()->getAuthAdapter()->resetAdapters();
        $this->zfcUserAuthentication()->getAuthService()->clearIdentity();
        
        $adapter = $this->zfcUserAuthentication()->getAuthAdapter();
        
        $result = $adapter->prepareForAuthentication($request);
        
        if ($result instanceof Response) {
            return $result;
        }
        
        $auth = $this->zfcUserAuthentication()->getAuthService()->authenticate($adapter);
        
        if (!$auth->isValid()) {
            $adapter->resetAdapters();
            return new JsonModel([
                'status' => 'error',
                'msg' => $this->failedLoginMessage
            ]);
        }
        
        return new JsonModel([
            'status' => 'OK',
            'user' => $this->getAppService()->getCurrentUserInfo()
        ]);
    }
    
    public function logoutAction()
    {
        $this->zfcUserAuthentication()->getAuthAdapter()->resetAdapters();
        $this->zfcUserAuthentication()->getAuthAdapter()->logoutAdapters();
        $this->zfcUserAuthentication()->getAuthService()->clearIdentity();

        $redirect = $this->redirectCallback;

        return $redirect();
    }

    public function authenticateAction()
    {
        if ($this->zfcUserAuthentication()->hasIdentity()) {
        	return $this->redirect()->toRoute($this->getOptions()->getLoginRedirectRoute());
        }

        $adapter = $this->zfcUserAuthentication()->getAuthAdapter();
        $redirect = $this->params()->fromPost('redirect', $this->params()->fromQuery('redirect', false));

        $result = $adapter->prepareForAuthentication($this->getRequest());

        // Return early if an adapter returned a response
        if ($result instanceof Response) {
            return $result;
        }

        $auth = $this->zfcUserAuthentication()->getAuthService()->authenticate($adapter);

        if (!$auth->isValid()) {
            $this->flashMessenger()->setNamespace('zfcuser-login-form')->addMessage($auth->getMessages());
            $adapter->resetAdapters();
            return $this->redirect()->toUrl(
                $this->url()->fromRoute(static::ROUTE_LOGIN) .
                ($redirect ? '?redirect='. rawurlencode($redirect) : '')
            );
        }

        $redirect = $this->redirectCallback;

        return $redirect();
    }

    public function registerAction()
    {
        $request = $this->getRequest();
        
        if(!$request->isPost() || !$request->isXmlHttpRequest() || $this->zfcUserAuthentication()->hasIdentity()) return $this->notFoundAction();
        
        $service = $this->getUserService();
        $form = $this->getRegisterForm();

        if ($this->getOptions()->getUseRedirectParameterIfPresent() && $request->getQuery()->get('redirect')) {
            $redirect = $request->getQuery()->get('redirect');
        } else {
            $redirect = false;
        }
        
       
        $post = $request->getPost()->toArray();
        $user = $service->register($post);
        
        if(!$user) {
            return new JsonModel([
                'status' => 'error',
                'msg' => $form->getMessages(),
            ]);
        }
        
        if ($service->getOptions()->getLoginAfterRegistration()) {
            $identityFields = $service->getOptions()->getAuthIdentityFields();
            if (in_array('email', $identityFields)) {
                $post['identity'] = $user->getEmail();
            } elseif (in_array('username', $identityFields)) {
                $post['identity'] = $user->getUsername();
            }
            $post['credential'] = $post['password'];
            
            $request->setPost ( new Parameters ( $post ) );
            
            $adapter = $this->zfcUserAuthentication()->getAuthAdapter();
    
            $result = $adapter->prepareForAuthentication($request);
            
            if ($result instanceof Response) {
                return $result;
            }
    
            $auth = $this->zfcUserAuthentication()->getAuthService()->authenticate($adapter);
    
            if (!$auth->isValid()) {
                $adapter->resetAdapters();
                return;
            }
            
            return new JsonModel(['status' => 'success']);
        }
        
        $vm = new ViewModel();
        $vm->setTerminal(true);
        $vm->setVariables([
            'registerForm' => $form,
            'redirect' => $redirect,
        ]);
        
        return $vm;
    }
    
    public function changepasswordAction()
    {
        // if the user isn't logged in, we can't change password
        if (!$this->zfcUserAuthentication()->hasIdentity()) {
            // redirect to the login redirect route
            return $this->redirect()->toRoute($this->getOptions()->getLoginRedirectRoute());
        }

        $form = $this->getChangePasswordForm();
        $prg = $this->prg(static::ROUTE_CHANGEPASSWD);

        $fm = $this->flashMessenger()->setNamespace('change-password')->getMessages();
        if (isset($fm[0])) {
            $status = $fm[0];
        } else {
            $status = null;
        }
		
        if ($prg instanceof Response) {
            return $prg;
        } elseif ($prg === false) {
            return array(
                'status' => $status,
                'changePasswordForm' => $form,
            );
        }

        $form->setData($prg);

        if (!$form->isValid()) {
            return array(
                'status' => false,
                'changePasswordForm' => $form,
            );
        }

        if (!$this->getUserService()->changePassword($form->getData())) {
            return array(
                'status' => false,
                'changePasswordForm' => $form,
            );
        }

        $this->flashMessenger()->setNamespace('change-password')->addMessage(true);
        return $this->redirect()->toRoute(static::ROUTE_CHANGEPASSWD);
    }

    public function changeemailAction()
    {
        // if the user isn't logged in, we can't change email
        if (!$this->zfcUserAuthentication()->hasIdentity()) {
            // redirect to the login redirect route
            return $this->redirect()->toRoute($this->getOptions()->getLoginRedirectRoute());
        }

        $form = $this->getChangeEmailForm();
        $request = $this->getRequest();
        $request->getPost()->set('identity', $this->getUserService()->getAuthService()->getIdentity()->getEmail());

        $fm = $this->flashMessenger()->setNamespace('change-email')->getMessages();
        if (isset($fm[0])) {
            $status = $fm[0];
        } else {
            $status = null;
        }
        
        $prg = $this->prg(static::ROUTE_CHANGEEMAIL);
        if ($prg instanceof Response) {
            return $prg;
        } elseif ($prg === false) {
            return array(
                'status' => $status,
                'changeEmailForm' => $form,
            );
        }

        $form->setData($prg);

        if (!$form->isValid()) {
            return array(
                'status' => false,
                'changeEmailForm' => $form,
            );
        }

        $change = $this->getUserService()->changeEmail($prg);

        if (!$change) {
            $this->flashMessenger()->setNamespace('change-email')->addMessage(false);
            return array(
                'status' => false,
                'changeEmailForm' => $form,
            );
        }

        $this->flashMessenger()->setNamespace('change-email')->addMessage(true);
        return $this->redirect()->toRoute(static::ROUTE_CHANGEEMAIL);
    }
    
    public function changeAvatarAction() 
    {
    	if (!$this->zfcUserAuthentication()->hasIdentity()) {
    		return $this->notFoundAction();
    	}
    	
    	$currentUser = $this->getUserService()->getAuthService()->getIdentity();
    	
    	if (!file_exists(AppConfig::USER_AVATAR_FOLDER)) {
    	    mkdir(AppConfig::USER_AVATAR_FOLDER, 0777, true);
    	}
    	
    	$form = $this->getChangeAvatarForm();
    	
    	$filter = new \Zend\Filter\File\RenameUpload ( [
    	    'target' => AppConfig::USER_AVATAR_FOLDER,
    	    'overwrite' => false,
    	    'randomize' => true,
    	    'use_upload_name' => false,
    	    'use_upload_extension' => true
    	] );
    	    	
    	$formInputFilter = $form->getInputFilter();
    	$formFilterChain = $formInputFilter->get('avatar')->getFilterChain();
    	$formFilterChain->attach($filter);
    	
    	$files = $this->params()->fromFiles();
    	
    	$form->setData($files);
		if(!$form->isValid()) {
		    $msg = '';
            foreach($form->getMessages() as $e=>$errs) {
                foreach ($errs as $err) {
                    $msg .= $err . '\n';
                }
            }
		    return new JsonModel([
		        'status' => 'error', 
		        'msg' => $msg
		    ]);
		}
		 
		$data = $form->getData();
		$avatar = $data['avatar'];
		$avatarFileName = preg_replace(AppConfig::USER_AVATAR_FOLDER_PREG, '', $avatar['tmp_name']);
    	
		if($currentUser->getAvatar()) {
		    $path = sprintf('%s/%s', AppConfig::USER_AVATAR_FOLDER, $currentUser->getAvatar());
		     
		    if(file_exists($path)) {
		        unlink($path);
		    }
		}
		 
		$path = sprintf('%s/%s', AppConfig::USER_AVATAR_FOLDER, $avatarFileName);
		
		if(file_exists($path)) {
		    $currentUser->setAvatar($avatarFileName);
		    $this->getUserService()->getUserMapper()->update($currentUser);
		}
		
    	return new JsonModel(['status' => 'OK']);
    }
    
    public function updatePositionAction() 
    {
        $request = $this->getRequest();
        
        if(!$request->isPost() || !$request->isXmlHttpRequest() || !$this->zfcUserAuthentication()->hasIdentity()) return $this->notFoundAction();
        
        $this->getAppService()->updateCurrentUserPosition($request->getPost()->toArray());
        
        return new JsonModel(['status' => 'OK']);
    }
    
    public function updateDescriptionAction()
    {
        $request = $this->getRequest();
        
        if(!$request->isPost() || !$request->isXmlHttpRequest() || !$this->zfcUserAuthentication()->hasIdentity()) return $this->notFoundAction();
        
        $hashtags = $this->getAppService()->updateCurrentUserDescription($request->getPost()->toArray());
        
        return new JsonModel(['status' => 'OK', 'hashtags' => $hashtags]);
    }
    
    public function getAppService()
    {
        if (!$this->appService) {
            $this->appService = $this->getServiceLocator()->get('app_app_service');
        }
        return $this->appService;
    }
    
    public function setAppService(AppService $appService)
    {
        $this->appService = $appService;
        return $this;
    }
    
    public function getUserService()
    {
        if (!$this->userService) {
            $this->userService = $this->getServiceLocator()->get('zfcuser_user_service');
        }
        return $this->userService;
    }

    public function setUserService(UserService $userService)
    {
        $this->userService = $userService;
        return $this;
    }

    public function getRegisterForm()
    {
        if (!$this->registerForm) {
            $this->setRegisterForm($this->getServiceLocator()->get('zfcuser_register_form'));
        }
        return $this->registerForm;
    }

    public function setRegisterForm(Form $registerForm)
    {
        $this->registerForm = $registerForm;
    }    

    public function getLoginForm()
    {
        if (!$this->loginForm) {
            $this->setLoginForm($this->getServiceLocator()->get('zfcuser_login_form'));
        }
        return $this->loginForm;
    }

    public function setLoginForm(Form $loginForm)
    {
        $this->loginForm = $loginForm;
        $fm = $this->flashMessenger()->setNamespace('zfcuser-login-form')->getMessages();
        if (isset($fm[0])) {
            $this->loginForm->setMessages(
                array('identity' => array($fm[0]))
            );
        }
        return $this;
    }

    public function getChangePasswordForm()
    {
        if (!$this->changePasswordForm) {
            $this->setChangePasswordForm($this->getServiceLocator()->get('zfcuser_change_password_form'));
        }
        return $this->changePasswordForm;
    }

    public function setChangePasswordForm(Form $changePasswordForm)
    {
        $this->changePasswordForm = $changePasswordForm;
        return $this;
    }
    
    public function getChangeAvatarForm()
    {
    	if (!$this->changeAvatarForm) {
    		$this->changeAvatarForm = $this->getServiceLocator()->get('zfcuser_change_avatar_form');
    	}
    	return $this->changeAvatarForm;
    }
    
    public function setChangeAvatarForm(Form $form)
    {
        $this->changeAvatarForm = $form;
        return $this;
    }

    public function setOptions(UserControllerOptionsInterface $options)
    {
        $this->options = $options;
        return $this;
    }

    public function getOptions()
    {
        if (!$this->options instanceof UserControllerOptionsInterface) {
            $this->setOptions($this->getServiceLocator()->get('zfcuser_module_options'));
        }
        return $this->options;
    }

    public function getChangeEmailForm()
    {
        if (!$this->changeEmailForm) {
            $this->setChangeEmailForm($this->getServiceLocator()->get('zfcuser_change_email_form'));
        }
        return $this->changeEmailForm;
    }

    public function setChangeEmailForm($changeEmailForm)
    {
        $this->changeEmailForm = $changeEmailForm;
        return $this;
    }
}
