<?php

namespace Application\Entity;

interface TagInterface
{
    public function getId();
    
    public function getName();
    
    public function getTotal();
    
    public function setId($id);
    
    public function setName($name);
    
    public function setTotal($total);
}
