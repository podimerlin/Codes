<?php

namespace Application\Form;

use ZfcBase\InputFilter\ProvidesEventsInputFilter;

class UpdateUserDescriptionFilter extends ProvidesEventsInputFilter
{
    public function __construct()
    {	
        $this->add ( [
            'name' => 'description',
            'required' => true,
            'filters' => [
                ['name'=>'StripTags'],
                ['name'=>'StringTrim'],
            ],
            'validators' => [
                [
                    'name' => 'StringLength',
                    'options' => [
                        'max' => 65000,
                    ],
                ]
            ]
        ] );
    }
}
