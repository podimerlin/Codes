<?php

namespace ZfcUser;

use Zend\ModuleManager\ModuleManager;
use Zend\Mvc\MvcEvent;
use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\ModuleManager\Feature\ServiceProviderInterface;

use ZfcUser\Controller\RedirectCallback;
use ZfcUser\Controller\UserController;

class Module implements
    AutoloaderProviderInterface,
    ConfigProviderInterface,
    ServiceProviderInterface
{
    /* public function init(ModuleManager $manager)
    {
        $events = $manager->getEventManager();
        $sharedEvents = $events->getSharedManager();
        $sharedEvents->attach(__NAMESPACE__, MvcEvent::EVENT_DISPATCH, function($e) {
            $app          = $e->getApplication();
            $locator      = $app->getServiceManager();
            $authService = $locator->get('zfcuser_auth_service');
            
        }, 100);
    } */
    
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function getConfig($env = null)
    {
        $config = array();
        
        $configFiles = array(
        	__DIR__ . '/config/module.config.php',
        	__DIR__ . '/config/module.config.routes.php',
        );
        
        // Merge all module config options
        foreach($configFiles as $configFile) {
        	$config = \Zend\Stdlib\ArrayUtils::merge($config, include $configFile);
        }
        
        return $config;
    }

    public function getControllerPluginConfig()
    {
        return array(
            'factories' => array(
                'zfcUserAuthentication' => function ($sm) {
                    $serviceLocator = $sm->getServiceLocator();
                    $authService = $serviceLocator->get('zfcuser_auth_service');
                    $authAdapter = $serviceLocator->get('ZfcUser\Authentication\Adapter\AdapterChain');
                    $controllerPlugin = new Controller\Plugin\ZfcUserAuthentication;
                    $controllerPlugin->setAuthService($authService);
                    $controllerPlugin->setAuthAdapter($authAdapter);
                    return $controllerPlugin;
				} 
			) 
		);
	}
	
	public function getControllerConfig() {
		return array (
			'factories' => array (
				'zfcuser' => function ($controllerManager) {
					/* @var ControllerManager $controllerManager */
					$serviceManager = $controllerManager->getServiceLocator ();
					
					/* @var RedirectCallback $redirectCallback */
					$redirectCallback = $serviceManager->get ( 'zfcuser_redirect_callback' );

             		/* @var UserController $controller */
           			$controller = new UserController($redirectCallback);

              		return $controller;
              	},
              	
            ),
        );
    }

    public function getViewHelperConfig()
    {
        return array(
            'factories' => array(
                'zfcUserIdentity' => function ($sm) {
                    $locator = $sm->getServiceLocator();
                    $viewHelper = new View\Helper\ZfcUserIdentity;
                    $viewHelper->setAuthService($locator->get('zfcuser_auth_service'));
                    return $viewHelper;
                },
            ),
        );
    }

    public function getServiceConfig()
    {
        return array(
            'invokables' => array(
                'ZfcUser\Authentication\Adapter\Db' => 'ZfcUser\Authentication\Adapter\Db',
                'ZfcUser\Authentication\Storage\Db' => 'ZfcUser\Authentication\Storage\Db',
                'ZfcUser\Form\Login'                => 'ZfcUser\Form\Login',
                'zfcuser_user_service'              => 'ZfcUser\Service\User',
                'zfcuser_register_form_hydrator'    => 'Zend\Stdlib\Hydrator\ClassMethods',
            ),
            'factories' => array(
                'zfcuser_redirect_callback' => function ($sm) {
               		/* @var RouteInterface $router */
                    $router = $sm->get('Router');

                    /* @var Application $application */
                 	$application = $sm->get('Application');

                	/* @var ModuleOptions $options */
                  	$options = $sm->get('zfcuser_module_options');

                	return new RedirectCallback($application, $router, $options);
                },
                'zfcuser_module_options' => function ($sm) {
                    $config = $sm->get('Config');
                    return new Options\ModuleOptions(isset($config['zfcuser']) ? $config['zfcuser'] : array());
                },
                // We alias this one because it's ZfcUser's instance of
                // Zend\Authentication\AuthenticationService. We don't want to
                // hog the FQCN service alias for a Zend\* class.
                'zfcuser_auth_service' => function ($sm) {
                    return new \Zend\Authentication\AuthenticationService(
                        $sm->get('ZfcUser\Authentication\Storage\Db'),
                        $sm->get('ZfcUser\Authentication\Adapter\AdapterChain')
                    );
                },

                'ZfcUser\Authentication\Adapter\AdapterChain' => 'ZfcUser\Authentication\Adapter\AdapterChainServiceFactory',

                'zfcuser_login_form' => function ($sm) {
                    $options = $sm->get('zfcuser_module_options');
                    $form = new Form\Login(null, $options);
                    $form->setInputFilter(new Form\LoginFilter($options));
                    return $form;
                },

                'zfcuser_register_form' => function ($sm) {
                    $form = new Form\Register(null); 
                    $form->setInputFilter(new Form\RegisterFilter(
                        new Validator\NoRecordExists([
                            'mapper' => $sm->get('zfcuser_user_mapper'),
                            'key'    => 'email',
                        ])
                    ));
                    return $form;
                },
               
                'zfcuser_change_password_form' => function ($sm) {
                    $options = $sm->get('zfcuser_module_options');
                    $form = new Form\ChangePassword(null, $sm->get('zfcuser_module_options'));
                    $form->setInputFilter(new Form\ChangePasswordFilter($options));
                    return $form;
                },

                'zfcuser_change_email_form' => function ($sm) {
                    $options = $sm->get('zfcuser_module_options');
                    $form = new Form\ChangeEmail(null, $options);
                    $form->setInputFilter(new Form\ChangeEmailFilter(
                        $options,
                        new Validator\NoRecordExists(array(
                            'mapper' => $sm->get('zfcuser_user_mapper'),
                            'key'    => 'email'
                        ))
                    ));
                    return $form;
                },
                
                'zfcuser_change_avatar_form' => function ($sm) {
                	$form = new Form\ChangeAvatar(null);
                	$form->setInputFilter(new Form\ChangeAvatarFilter());
                	return $form;
                },
             
                'zfcuser_user_hydrator' => function ($sm) {
                    $hydrator = new \Zend\Stdlib\Hydrator\ClassMethods();
                    return $hydrator;
                },
                'zfcuser_user_mapper' => function ($sm) {
                    $options = $sm->get('zfcuser_module_options');
                    $mapper = new Mapper\User();
                    $mapper->setDbAdapter($sm->get('zfcuser_zend_db_adapter'));
                    $entityClass = $options->getUserEntityClass();
                    $mapper->setEntityPrototype(new $entityClass);
                    $mapper->setHydrator(new Mapper\UserHydrator());
                    $mapper->setTableName($options->getTableName());
                    return $mapper;
                },
            ),
        );
    }
}
