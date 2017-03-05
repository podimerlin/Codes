<?php

namespace Application\Mapper;

use Zend\Stdlib\Hydrator\ClassMethods;
use Application\Entity\TagInterface as TagEntityInterface;

class TagHydrator extends ClassMethods
{

    /**
     * Extract values from an object
     *
     * @param  object $object
     * @return array
     * @throws Exception\InvalidArgumentException
     */
    public function extract($object)
    {
        if (!$object instanceof TagEntityInterface) {
            throw new Exception\InvalidArgumentException('$object must be an instance of Application\Entity\TagInterface');
        }
       
        $data = parent::extract($object);
        
        return $data;
    }

    /**
     * Hydrate $object with the provided $data.
     *
     * @param  array $data
     * @param  object $object
     * @return TagInterface
     * @throws Exception\InvalidArgumentException
     */
    public function hydrate(array $data, $object)
    {
        if (!$object instanceof TagEntityInterface) {
            throw new Exception\InvalidArgumentException('$object must be an instance of Application\Entity\TagInterface');
        }
        
        return parent::hydrate($data, $object);
    }

    protected function mapField($keyFrom, $keyTo, array $array)
    {
        $array[$keyTo] = $array[$keyFrom];
        unset($array[$keyFrom]);
        return $array;
    }
}
