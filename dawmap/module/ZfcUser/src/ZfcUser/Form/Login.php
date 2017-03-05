<?php

namespace ZfcUser\Form;

use Zend\Form\Form;
use Zend\Form\Element;
use ZfcBase\Form\ProvidesEventsForm;
use ZfcUser\Options\AuthenticationOptionsInterface;
use ZfcUser\Module as ZfcUser;

class Login extends ProvidesEventsForm
{
    /**
     * @var AuthenticationOptionsInterface
     */
    protected $authOptions;

    public function __construct($name, AuthenticationOptionsInterface $options)
    {
        $this->setAuthenticationOptions($options);
        parent::__construct($name);

        $this->add(array(
            'name' => 'identity',
            'options' => array(
                'label' => 'Email Address',
            	'label_attributes' => array (
            		'class' => 'control-label'
            	)
            ),
            'attributes' => array(
                'type' => 'text',
                'placeholder' => 'Email Address',
            	'class' => 'form-control'
            ),
        ));

        $this->add(array(
            'name' => 'credential',
            'options' => array(
                'label' => 'Password',
            	'label_attributes' => array (
            		'class' => 'control-label'
            	)
            ),
            'attributes' => array(
                'type' => 'password',
                'placeholder' => 'Password',
            	'class' => 'form-control'
            ),
        ));

        /* $this->add ( [
            'name' => '_token',
            'type' => 'Csrf',
            'options' => [
                'csrf_options' => [
                    
                ],
            ],
        ] ); */
    }

    /**
     * Set Authentication-related Options
     *
     * @param AuthenticationOptionsInterface $authOptions
     * @return Login
     */
    public function setAuthenticationOptions(AuthenticationOptionsInterface $authOptions)
    {
        $this->authOptions = $authOptions;
        return $this;
    }

    /**
     * Get Authentication-related Options
     *
     * @return AuthenticationOptionsInterface
     */
    public function getAuthenticationOptions()
    {
        return $this->authOptions;
    }
}
