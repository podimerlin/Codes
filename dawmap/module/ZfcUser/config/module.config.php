<?php
return array(
    'view_manager' => array(
        'template_path_stack' => array(
            'zfcuser' => __DIR__ . '/../view',
        ),
    ),
	'controllers' => array (
		'invokables' => array (
			
		)
	),
    'service_manager' => array(
        'aliases' => array(
            'zfcuser_zend_db_adapter' => 'Zend\Db\Adapter\Adapter',
        	'Zend\Authentication\AuthenticationService' => 'zfcuser_auth_service'
        ),
    ),
);
