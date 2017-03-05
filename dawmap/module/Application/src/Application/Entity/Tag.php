<?php

namespace Application\Entity;

class Tag implements TagInterface
{
    protected $id;
    protected $name;
    protected $total;
    
    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getTotal()
    {
        return $this->total;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function setTotal($total)
    {
        $this->total = $total;
    }

}
