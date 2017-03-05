<?php

namespace Application\Mapper;

interface TagInterface
{
    public function findById($id);

    public function insert($entity);

    public function update($entity);
}
