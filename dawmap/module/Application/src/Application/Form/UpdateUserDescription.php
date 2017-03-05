<?php
namespace Application\Form;

use ZfcBase\Form\ProvidesEventsForm;

class UpdateUserDescription extends ProvidesEventsForm
{
    public function __construct($name)
    {
        parent::__construct($name);

		$this->add ( [
            'name' => 'description',
            'type' => 'Textarea',
            'options' => [
                'label' => 'Description',
                'label_attributes' => [
                    'class' => 'control-label'
                ]
            ],
            'attributes' => [
                'class' => 'form-control noresize',
                'rows' => 4,
                'placeholder' => 'Type your text and #hashtag',
                'required' => true
            ]
        ] );
    }
}

