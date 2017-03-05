<?php

namespace ZfcUser\Form;

use ZfcBase\Form\ProvidesEventsForm;

class Register extends ProvidesEventsForm
{
    public function __construct($name)
    {
        parent::__construct($name);

		$this->add ( [
			'name' => 'email',
			'options' => [
				'label' => 'Email Address',
				'label_attributes' => [
					'class' => 'control-label' 
				] 
			],
			'attributes' => [
				'type' => 'email',
				'class' => 'form-control',
			    'placeholder' => 'Email Address',
			    'required' => true
			],
		] );
		
		$this->add ( [
			'name' => 'display_name',
			'options' => [
				'label' => 'Name',
				'label_attributes' => [
					'class' => 'control-label' 
				] 
			],
			'attributes' => [
				'class' => 'form-control',
			    'placeholder' => 'Name',
			    'required' => true
			] 
		] );
		
		$this->add ( [
			'name' => 'password',
			'options' => [
				'label' => 'Password',
				'label_attributes' => [
					'class' => 'control-label',
				] 
			],
			'attributes' => [
				'type' => 'password',
				'class' => 'form-control',
			    'required' => true,
			    'placeholder' => 'Password',
			] 
		] );
		
		$this->add ( [
			'name' => 'passwordVerify',
			'options' => [
				'label' => 'Confirm Password',
				'label_attributes' => [
					'class' => 'control-label'
				] 
			],
			'attributes' => [
				'type' => 'password',
				'class' => 'form-control',
			    'placeholder' => 'Confirm Password',
			    'required' => true
			]
		] );
		
		
		/* $this->add ( [
		    'name' => '_token', 
            'type' => 'Csrf',
            'options' => [
                'csrf_options' => [
                    'timeout' => 3600
                ],
            ],
		] ); */
    }
}
