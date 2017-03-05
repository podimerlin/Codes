<?php 
return array(
	'router' => array(
		'routes' => array(
			'zfcuser' => array(
				'type' => 'Literal',
				'priority' => 1000,
				'options' => array(
					'route' => '/user',
					'defaults' => array(
						'controller' => 'zfcuser',
						'action'     => 'index',
					),
				),
				'may_terminate' => true,
				'child_routes' => array(
					'login' => array(
						'type' => 'Literal',
						'options' => array(
							'route' => '/login',
							'defaults' => array(
								'controller' => 'zfcuser',
								'action'     => 'login',
							),
						),
					),
				    'login-ajax' => array(
						'type' => 'Literal',
						'options' => array(
							'route' => '/login-ajax',
							'defaults' => array(
								'controller' => 'zfcuser',
								'action'     => 'loginAjax',
							),
						),
					),
					'authenticate' => array(
						'type' => 'Literal',
						'options' => array(
							'route' => '/authenticate',
							'defaults' => array(
								'controller' => 'zfcuser',
								'action'     => 'authenticate',
							),
						),
					),
					'logout' => array(
						'type' => 'Literal',
						'options' => array(
							'route' => '/logout',
							'defaults' => array(
								'controller' => 'zfcuser',
								'action'     => 'logout',
							),
						),
					),
					'register' => array(
						'type' => 'Literal',
						'options' => array(
							'route' => '/register',
							'defaults' => array(
								'controller' => 'zfcuser',
								'action'     => 'register',
							),
						),
					),
					'update-position' => array (
						'type' => 'Literal',
						'options' => array (
							'route' => '/update-position',
							'defaults' => array (
								'controller' => 'zfcuser',
								'action' => 'updatePosition' 
							) 
						) 
					),
				    'update-description' => array (
						'type' => 'Literal',
						'options' => array (
							'route' => '/update-description',
							'defaults' => array (
								'controller' => 'zfcuser',
								'action' => 'updateDescription' 
							) 
						) 
					),
					'change-avatar' => array (
						'type' => 'Literal',
						'options' => array (
							'route' => '/change-avatar',
							'defaults' => array (
								'controller' => 'zfcuser',
								'action' => 'changeAvatar' 
							) 
						) 
					),
					'changepassword' => array(
						'type' => 'Literal',
						'options' => array(
							'route' => '/change-password',
							'defaults' => array(
								'controller' => 'zfcuser',
								'action'     => 'changepassword',
							),
						),
					),
					'changeemail' => array (
						'type' => 'Literal',
						'options' => array (
							'route' => '/change-email',
							'defaults' => array (
								'controller' => 'zfcuser',
								'action' => 'changeemail' 
							) 
						) 
					),
				),
			),
		),
	),
);