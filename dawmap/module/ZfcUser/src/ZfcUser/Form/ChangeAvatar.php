<?php
namespace ZfcUser\Form;

use ZfcBase\Form\ProvidesEventsForm;
use ZfcUser\Options\AuthenticationOptionsInterface;

class ChangeAvatar extends ProvidesEventsForm
{
    public function __construct($name)
    {
        parent::__construct($name);

        $this->add(array(
            'name' => 'avatar',
            'type' => 'File',
            'attributes' => array(
        		
        	),
            'options' => array(
                'label' => 'Avatar',
            )
        ));
    }
}