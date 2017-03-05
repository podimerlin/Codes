<?php 
namespace Application\Validator;

use Zend\Validator\NotEmpty as BaseNotEmpty;

class NotEmpty extends BaseNotEmpty
{
    protected $messageTemplates = array(
        self::IS_EMPTY => "The field is not empty",
        self::INVALID  => "Invalid type given. String, integer, float, boolean or array expected",
    );
}
