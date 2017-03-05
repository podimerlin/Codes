<?php
return array(
    'service_manager' => array(
    	'factories' => array(
    	),
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'app_home' => 'Application\Controller\IndexController',
            'app_helper' => 'Application\Controller\HelperController',
            'app_api' => 'Application\Controller\ApiController',
        ),
    ),
    'validators' => [
        'invokables' => [
            'not-empty' => 'Application\Validator\NotEmpty',
        ],
    ],
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ),
        'template_path_stack' => array(
        	'application' => __DIR__ . '/../view',
        ),
        'strategies' => array(
       		'ViewJsonStrategy',
        ),
    ),
);
