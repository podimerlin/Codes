<?php

namespace ZfcUser\Form;

use Zend\InputFilter\InputFilter;

class ChangeAvatarFilter extends InputFilter
{
    public function __construct() 
    {
		$this->add ( [ 
			'name' => 'avatar',
			'type' => 'Zend\InputFilter\FileInput',
			'required' => true,
			'filters' => [],
			'validators' => [
				[
					'name' => 'Zend\Validator\File\IsImage',
				],
				[
					'name' => 'Zend\Validator\File\Size',
					'options' => [
						'min' => '1kB',
						'max' => '2MB'
					],
				],
				[
					'name' => 'Zend\Validator\File\Extension',
					'options' => ['png','jpg','jpeg','gif', 'bmp'],
				],
			],
		] );
    }
}
