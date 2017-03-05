<?php

namespace Application\Mapper;

use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;
use Zend\Stdlib\Hydrator\HydratorInterface;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Expression;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;
use Application\Mapper\TagInterface as TagMapperInterface;
use Application\Mapper\AbstractDbMapper;

class Tag extends AbstractDbMapper implements TagMapperInterface
{
    protected $alias = 't';
    protected $tableName  = 'tag';
    protected $orderBy = 't.name';
    protected $sortDirection = 'ASC';

    
    public function findByName($name)
    {
        $select = $this->getSelect()
            ->where(array('name' => $name));
         
        $entity = $this->select($select)->current();
        return $entity;
    }
    
    public function findById($id)
    {
    	$select = $this->getSelect()
    					->where(array('id' => $id));
    	
    	$entity = $this->select($select)->current();
    	return $entity;
    }

    public function insert($entity, $tableName = null, HydratorInterface $hydrator = null)
    {
        $result = parent::insert($entity, $tableName, $hydrator);
        $entity->setId($result->getGeneratedValue());
        return $result;
    }

    public function update($entity, $where = null, $tableName = null, HydratorInterface $hydrator = null)
    {
        if (!$where) {
            $where = array('id' => $entity->getId());
        }

        return parent::update($entity, $where, $tableName, $hydrator);
    }
    
    public function getTableName()
    {
    	return $this->tableName;
    }
    
    public function setTableName($tableName)
    {
    	$this->tableName = $tableName;
    }
}
