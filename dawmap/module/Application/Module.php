<?php
namespace Application;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\EventManager\EventInterface;

class Module
{
    public function onBootstrap($e)
    {
        // Register a render event
        $app = $e->getParam('application');
        $app->getEventManager()->attach('render', array($this, 'setLayoutTitle'));
        
        $eventManager = $app->getEventManager();
        $serviceManager = $app->getServiceManager();
        $eventManager->attach('dispatch.error', function ($event) use ($serviceManager) {
            $exception = $event->getResult()->exception;
            if (!$exception) return;
            $service = $serviceManager->get('ApplicationServiceErrorHandling');
            $service->logException($exception);
        });
    }
    
    public function setLayoutTitle($e)
    {
        /* $matches    = $e->getRouteMatch();
        $controller = $matches->getParam('controller');
        $action     = $matches->getParam('action'); */
         
        $siteName   = 'Dawmap';
    
        // Getting the view helper manager from the application service manager
        $viewHelperManager = $e->getApplication()->getServiceManager()->get('viewHelperManager');
    
        // Getting the headTitle helper from the view helper manager
        $headTitleHelper   = $viewHelperManager->get('headTitle');
    
        // Setting a separator string for segments
        $headTitleHelper->setSeparator(' - ');
    
        // Setting the action, controller, module and site name as title segments
        $headTitleHelper->append($siteName);
    }
    
    /* public function onBootstrap(EventInterface $e)
    {
        $target = $e->getTarget();
        $application = $e->getApplication();
        $eventManager = $application->getEventManager();
        $serviceManager = $application->getServiceManager();
        
        $target->getEventManager()->attach(
            $target->getServiceManager()->get('ZfcRbac\View\Strategy\RedirectStrategy')
        );
        $target->getEventManager()->attach(
            $target->getServiceManager()->get('ZfcRbac\View\Strategy\UnauthorizedStrategy')
        );
        
    } */
    
    public function getViewHelperConfig()
    {
        return array(
            'factories' => array(
                
            ),
        );
    }
    
    public function getServiceConfig() 
    {
		return [
			'invokables' => [
                'app_app_service'  => 'Application\Service\App',
            ],
			'factories' => [
				'ApplicationServiceErrorHandling' => function ($sm) {
					$logger = $sm->get ('ZendErrorLogger');
					$service = new \Application\Service\ErrorHandling( $logger );
					return $service;
				},
				'ZendErrorLogger' => function ($sm) {
					$filename = 'log_' . date ( 'Y-m-d' ) . '.txt';
					$log = new \Zend\Log\Logger ();
					$writer = new \Zend\Log\Writer\Stream( './data/log/' . $filename );
					$log->addWriter ($writer);
					return $log;
    			},
    			'app_tag_mapper' => function ($sm) {
                    $mapper = new Mapper\Tag;
                    $mapper->setDbAdapter($sm->get('zfcuser_zend_db_adapter'));
                    $mapper->setEntityPrototype(new Entity\Tag);
                    $mapper->setHydrator(new Mapper\TagHydrator());
                    return $mapper;
                },
    			'app_update_user_description_form' => function ($sm) {
                    $form = new Form\UpdateUserDescription(null);
                    $form->setInputFilter(new Form\UpdateUserDescriptionFilter());
                    return $form;
                },
    		],
    	];
    }
    
    public function getConfig()
    {
    	$config = [];
    
    	$configFiles = [
    		__DIR__ . '/config/module.config.php',
    		__DIR__ . '/config/module.config.routes.php',
    	];
    
    	// Merge all module config options
    	foreach($configFiles as $configFile) {
    		$config = \Zend\Stdlib\ArrayUtils::merge($config, include $configFile);
    	}
    
    	return $config;
    }

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
}
