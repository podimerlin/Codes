<?php
return [ 
	'router' => [ 
		'routes' => [ 
			'home' => [
				'type' => 'Literal',
				'options' => [ 
					'route' => '/',
					'defaults' => [ 
						'controller' => 'app_home',
						'action' => 'index' 
					]
				] 
			],
		    'application' => [
		        'type'    => 'Segment',
		        'options' => [
		            'route'    => '/app[/:action]',
		            'constraints' => [
		                'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
		            ],
		            'defaults' => [
		                'controller'    => 'app_home',
		                'action'        => 'index',
		            ],
		        ],
		    ],
		    'api' => [
		        'type'    => 'Segment',
		        'options' => [
		            'route'    => '/api[/:action[/:id]]',
		            'constraints' => [
		                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
		                'id' => '[0-9]+'
		            ],
		            'defaults' => [
		                'controller' => 'app_api',
		                'action' => 'index',
		            ],
		        ],
		    ],
		    'helper' => [
		        'type' => 'Segment',
		        'options' => [
		            'route' => '/helper[/:action]',
		            'constrains' => [
		                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
		            ],
		            'defaults' => [
		                'controller' => 'app_helper',
		                'action' => 'index'
		            ],
		        ],
		    ],
		]		
	],
	
	'console' => [ 
		'router' => [ 
			'routes' => [ 
				
			] 
		] 
	] 
];
