<?php

namespace ZfcUser\Form;

use ZfcBase\InputFilter\ProvidesEventsInputFilter;
use ZfcUser\Module as ZfcUser;

class RegisterFilter extends ProvidesEventsInputFilter
{
    protected $emailValidator;

    public function __construct($emailValidator)
    {
        $this->emailValidator = $emailValidator;
		
		$this->add ( [
			'name' => 'display_name',
			'required' => true,
			'filters' => [ 
				['name'=>'StripTags'],
                ['name'=>'StringTrim'],
			],
			'validators' => [
			    [
			        'name' => 'NotEmpty',
			        'options' => [
			            'encoding' => 'UTF-8',
			        ],
			        'break_chain_on_failure' => true,
			    ],
				[
					'name' => 'StringLength',
					'options' => [
						'max' => 250,
					],
				    'break_chain_on_failure' => true,
				] 
			] 
		] );
        
       	$this->add([
            'name'       => 'email',
            'required'   => true,
       		'filters' => [ 
				['name'=>'StripTags'],
                ['name'=>'StringTrim'],
			],
            'validators' => [
                [
			        'name' => 'NotEmpty',
			        'options' => [
			            'encoding' => 'UTF-8',
			        ],
			        'break_chain_on_failure' => true,
			    ],
                [
					'name' => 'EmailAddress',
                    'break_chain_on_failure' => true,
				],
				[
					'name' => 'StringLength',
					'options' => [
            			'min' => 3,
            			'max' => 128,
            		],
				    'break_chain_on_failure' => true,
            	],
                $this->emailValidator
            ],
        ]);

        $this->add([
            'name'       => 'password',
            'required'   => true,
            'filters' => [ 
				['name'=>'StripTags'],
                ['name'=>'StringTrim'],
			],
            'validators' => [
                [
			        'name' => 'NotEmpty',
			        'options' => [
			            'encoding' => 'UTF-8',
			        ],
			        'break_chain_on_failure' => true,
			    ],
                [
                    'name'    => 'StringLength',
                    'options' => [
                        'min' => 6,
                    	'max' => 128,
                    ],
                    'break_chain_on_failure' => true,
                ],
            ],
        ]);

        $this->add([
            'name'       => 'passwordVerify',
            'required'   => true,
            'filters' => [ 
				['name'=>'StripTags'],
                ['name'=>'StringTrim'],
			],
            'validators' => [
                [
			        'name' => 'NotEmpty',
			        'options' => [
			            'encoding' => 'UTF-8',
			        ],
			        'break_chain_on_failure' => true,
			    ],
                [
                    'name'    => 'StringLength',
                    'options' => [
                        'min' => 6,
        				'max' => 128,
                    ],
                    'break_chain_on_failure' => true,
                ],
                [
                    'name'    => 'Identical',
                    'options' => [
                        'token' => 'password',
					],
                    'break_chain_on_failure' => true,
				] 
			] 
		] );
    }

    public function getEmailValidator()
    {
        return $this->emailValidator;
    }

    public function setEmailValidator($emailValidator)
    {
        $this->emailValidator = $emailValidator;
        return $this;
    }
}
