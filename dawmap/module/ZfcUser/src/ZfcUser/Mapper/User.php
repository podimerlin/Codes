<?php

namespace ZfcUser\Mapper;

use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;
use Zend\Stdlib\Hydrator\HydratorInterface;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Expression;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;
use ZfcUser\Mapper\UserInterface as UserMapperInterface;
use Application\Mapper\AbstractDbMapper;

class User extends AbstractDbMapper implements UserMapperInterface, ServiceManagerAwareInterface
{
    protected $alias = 'u';
    protected $tableName  = 'user';
    protected $orderBy = 'u.date_added';
    protected $sortDirection = 'DESC';
    
    protected $urlHelper;

    public function getUser($data = array(), $toArray = true)
    {
        $adaptor = $this->getDbAdapter();
        $sql = new Sql($adaptor);
        $select = $sql->select();
        
        $select->from(['u' => $this->getTableName()]);
            
        if(isset($data['where'])) $select->where($this->getPredicateSet($data['where']));
        
        if(!$toArray) return $this->select($select)->current();   
        
        $sqlString = $sql->getSqlStringForSqlObject($select);
        $result =  $adaptor->query($sqlString, $adaptor::QUERY_MODE_EXECUTE);
        return ($result->current()) ? (array)$result->current() : false;
    }
    
    public function getUsers($data = array(), $toArray = true)
    {
        $adaptor = $this->getDbAdapter();
        $sql = new Sql($adaptor);
        $select = $sql->select();
        $select->from(['u' => $this->getTableName()]);
                   
        $orders = isset($data['order']) ? $data['order'] : null;
        $select->order($this->getOrderString($orders));
    
        if(isset($data['where'])) $select->where($this->getPredicateSet($data['where']));
        
        if(!$toArray) return $this->select($select);
        $this->logSqlStringForSelect($select);
        $sqlString = $sql->getSqlStringForSqlObject($select);
        $result =  $adaptor->query($sqlString, $adaptor::QUERY_MODE_EXECUTE);
        return $result->toArray();
    }
    
    public function fetchPageforPublic($data = array())
    {
        $adaptor = $this->getDbAdapter();
        $sql = new Sql($adaptor);
        $select = $sql->select();
        $select->from(['u' => $this->getTableName()]);
            //->join(['ut' => 'user_teaching'], 'u.id=ut.user_id', ['teaching_id'], $select::JOIN_LEFT)
            //->join(['t' => 'teaching'], 'ut.teaching_id=t.id', ['level_id', 'subject_id'], $select::JOIN_LEFT)
        
        $select->quantifier($select::QUANTIFIER_DISTINCT);
        $select->columns(['id', 'avatar', 'display_name', 'seo_name', 'gender', 'birthday', 'teaching_status', 'occupation', 'description', 'hourly_fee']);
        
        $orders = isset($data['order']) ? $data['order'] : null;
        $select->order($this->getOrderString($orders));
        
        if(isset($data['where'])) $select->where($this->getPredicateSet($data['where']));
        
        if(isset($data['district_ids']) && !empty($data['district_ids']) && is_array($data['district_ids'])) {
            $selectLocation = $sql->select();
            $selectLocation->from(['ul' => 'user_location']);
            $selectLocation->quantifier($selectLocation::QUANTIFIER_DISTINCT);
            $selectLocation->columns(['user_id']);
            
            $where = [];
            $where['ul.district_id'] = [
                'operator' => 'IN',
                'value' => $data['district_ids']
            ];
            $selectLocation->where($this->getPredicateSet($where));
            $select->join(['L' => $selectLocation], 'u.id = L.user_id', [], $select::JOIN_INNER);
        }
        
        if(isset($data['level_id']) && !empty($data['level_id'])) {
            $selectTeaching = $sql->select();
            $selectTeaching->from(['ut' => 'user_teaching'])
                ->join(['t' => 'teaching'], 'ut.teaching_id=t.id', [], $select::JOIN_INNER);
            
            $selectTeaching->quantifier($selectTeaching::QUANTIFIER_DISTINCT);
            $selectTeaching->columns(['user_id']);
            
            $where = [];
            $where['t.level_id'] = $data['level_id'];
            if(isset($data['subject_ids']) && !empty($data['subject_ids']) && is_array($data['subject_ids'])) {
                $where['t.subject_id'] = [
                    'operator' => 'IN',
                    'value' => $data['subject_ids']
                ];
            }
            $selectTeaching->where($this->getPredicateSet($where));
            $select->join(['T' => $selectTeaching], 'u.id = T.user_id', [], $select::JOIN_INNER);
        }
        
        $paginator = new Paginator(new DbSelect($select, $adaptor));
        
        if(isset($data['limit'])) $paginator->setItemCountPerPage($data['limit']);
        if(isset($data['page'])) $paginator->setCurrentPageNumber($data['page']);
            
        return $paginator;
    }
    
    public function getTotalUsers($where = null)
    {
        $adaptor = $this->getDbAdapter();
        $sql = new Sql($adaptor);
        $select = $sql->select();
        $select->from($this->getTableName());
        
        $select->columns(['num' => new Expression('COUNT(*)')]);
        
        if($where) $select->where($this->getPredicateSet($where));
        
        $sqlString = $sql->getSqlStringForSqlObject($select);
        $result = $adaptor->query($sqlString, $adaptor::QUERY_MODE_EXECUTE);
        $current = $result->current();
        return $current['num'];
    }
    
    public function findByEmail($email)
    {
        $select = $this->getSelect()
                       ->where(array('email' => $email));

        $entity = $this->select($select)->current();
        $this->getEventManager()->trigger('find', $this, array('entity' => $entity));
        return $entity;
    }

    public function findByUsername($username)
    {
        $select = $this->getSelect()
                       ->where(array('username' => $username));

        $entity = $this->select($select)->current();
        $this->getEventManager()->trigger('find', $this, array('entity' => $entity));
        return $entity;
    }
    
    public function findById($id)
    {
    	$select = $this->getSelect()
    					->where(array('id' => $id));
    	
    	$entity = $this->select($select)->current();
    	$this->getEventManager()->trigger('find', $this, array('entity' => $entity));
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
    
    public function getUrlHelper()
    {
    	if($this->urlHelper == null) {
    		$this->urlHelper = $this->getServiceManager()->get('ViewHelperManager')->get('url');
    	}
    	return $this->urlHelper;
    }
    
    public function getServiceManager()
    {
    	return $this->serviceManager;
    }
    
    public function setServiceManager(ServiceManager $serviceManager)
    {
    	$this->serviceManager = $serviceManager;
    	return $this;
    }
}
