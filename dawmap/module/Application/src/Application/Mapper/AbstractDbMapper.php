<?php

namespace Application\Mapper;

use Zend\Db\Adapter\Adapter;
use Zend\Db\Adapter\Driver\ResultInterface;
use Zend\Db\ResultSet\HydratingResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Predicate;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\Sql\TableIdentifier;
use Zend\Stdlib\Hydrator\HydratorInterface;
use Zend\Stdlib\Hydrator\ClassMethods;
use ZfcBase\EventManager\EventProvider;
use ZfcBase\Db\Adapter\MasterSlaveAdapterInterface;

abstract class AbstractDbMapper extends EventProvider
{
    /**
     * @var Adapter
     */
    protected $dbAdapter;

    /**
     * @var Adapter
     */
    protected $dbSlaveAdapter;

    /**
     * @var HydratorInterface
     */
    protected $hydrator;

    /**
     * @var object
     */
    protected $entityPrototype;

    /**
     * @var HydratingResultSet
     */
    protected $resultSetPrototype;

    /**
     * @var Select
     */
    protected $selectPrototype;

    /**
     * @var Sql
     */
    private $sql;

    /**
     * @var Sql
     */
    private $slaveSql;

    /**
     * @var string
     */
    protected $tableName;

    /**
     * @var boolean
     */
    private $isInitialized = false;
    
    protected $alias;
    protected $orderBy;
    protected $sortDirection;
    
    public function fetchBy($data = array(), $toArray = true)
    {
        $adaptor = $this->getDbAdapter();
        $sql = new Sql($adaptor);
        $select = $sql->select();
    
        $select->from([$this->getAlias() => $this->getTableName()]);
    
        $orders = isset($data['order']) ? $data['order'] : null;
        $select->order($this->getOrderString($orders));
    
        if(isset($data['where'])) $select->where($this->getPredicateSet($data['where']));
    
        if(!$toArray) return $this->select($select);
    
        $sqlString = $sql->getSqlStringForSqlObject($select);
        $result =  $adaptor->query($sqlString, $adaptor::QUERY_MODE_EXECUTE);
        return $result->toArray();
    }
    
    protected function getOrderString($orders)
    {
        $str = '';
        if($orders) {
            foreach($orders as $i=>$order) {
                $str .= $order[0] . ' ' . $order[1];
                if(++$i!=count($orders)) {
                    $str .= ', ';
                }
            }
        } elseif( ($this->getOrderBy() !== null) && ($this->getSortDirection() != null) ) {
            $str = sprintf('%s %s', $this->getOrderBy(), $this->getSortDirection());
        }
         
        return $str;
    }
    
    protected function getPredicateSet($conditions = array(), $combination = PredicateSet::OP_AND)
    {
        $predicates = [];
    
        foreach($conditions as $key=>$condition) {
            $predicate = $this->getPredicate($key, $condition);
            
            if($predicate !== false) {
                $predicates[] = $predicate;
            }
        }
    
        if(!empty($predicates)) {
            return [
                new PredicateSet(
                    $predicates,
                    $combination
                ),
            ];
        }
        
        return array();
    }
    
    protected function getPredicate($key, $condition)
    {
        if(is_array($condition)) {
            $operator = $condition['operator'];
            $value = $condition['value'];

            if((strtoupper($operator) == 'IN')) {
                if(is_array($value)) {
                    return new Predicate\In($key, $value);
                } else {
                    return new Predicate\In($key, ['0']);
                }
            } elseif((strtoupper($operator) == 'NOT IN') && is_array($value)) {
                return new Predicate\NotIn($key, $value);
            } elseif((strtoupper($operator) == 'BETWEEN') && is_array($value) && isset($value['min']) && isset($value['max']) ) {
                return new Predicate\Between($key, $value['min'], $value['max']);
            } elseif(in_array($operator, ['!=', '=','>', '>=', '<', '<='])) {
                return new Predicate\Operator($key, $operator, $value);
            } elseif((strtoupper($operator) == 'LIKE') && is_string($value)) {
                return new Predicate\Like($key, '%'.$value.'%');
            }
        } else {
            return new Predicate\Operator($key, '=', $condition);
        }
        
        return false;
    }
    
    protected function getAlias()
    {
        return $this->alias;
    }
    
    protected function getOrderBy()
    {
        return $this->orderBy;
    }
    
    protected function getSortDirection()
    {
        return $this->sortDirection;
    }
    
    protected function logSqlStringForSelect($select)
    {
        $adaptor = $this->getDbAdapter();
        $sql = new Sql($adaptor);  
        $sqlString = $sql->getSqlStringForSqlObject($select);
        $writer = new \Zend\Log\Writer\Stream(getcwd() . "/data/log/sql.txt");
        $format = '%message%' . PHP_EOL;
        $formatter = new \Zend\Log\Formatter\Simple($format);
        $writer->setFormatter($formatter);
        $logger = new \Zend\Log\Logger();
        $logger->addWriter($writer);
        $logger->info($sqlString);
    }

    /**
     * Performs some basic initialization setup and checks before running a query
     * @return null
     */
    protected function initialize()
    {
        if ($this->isInitialized) {
            return;
        }

        if (!$this->dbAdapter instanceof Adapter) {
            throw new \Exception('No db adapter present');
        }

        if (!$this->hydrator instanceof HydratorInterface) {
            $this->hydrator = new ClassMethods;
        }

        if (!is_object($this->entityPrototype)) {
            throw new \Exception('No entity prototype set');
        }

        $this->isInitialized = true;
    }

    /**
     * @param string|null $table
     * return Select
     */
    protected function getSelect($table = null)
    {
        $this->initialize();
        return $this->getSlaveSql()->select($table ?: $this->getTableName());
    }

    /**
     * @param Select $select
     * @param object|null $entityPrototype
     * @param HydratorInterface|null $hydrator
     * @return HydratingResultSet
     */
    protected function select(Select $select, $entityPrototype = null, HydratorInterface $hydrator = null)
    {
        $this->initialize();

        $stmt = $this->getSlaveSql()->prepareStatementForSqlObject($select);

        $resultSet = new HydratingResultSet($hydrator ?: $this->getHydrator(),
            $entityPrototype ?: $this->getEntityPrototype());

        $resultSet->initialize($stmt->execute());
        return $resultSet;
    }

    /**
     * @param object|array $entity
     * @param string|TableIdentifier|null $tableName
     * @param HydratorInterface|null $hydrator
     * @return ResultInterface
     */
    protected function insert($entity, $tableName = null, HydratorInterface $hydrator = null)
    {
        $this->initialize();
        $tableName = $tableName ?: $this->tableName;

        $sql = $this->getSql()->setTable($tableName);
        $insert = $sql->insert();

        $rowData = $this->entityToArray($entity, $hydrator);
        $insert->values($rowData);

        $statement = $sql->prepareStatementForSqlObject($insert);

        return $statement->execute();
    }

    /**
     * @param object|array $entity
     * @param string|array|closure $where
     * @param string|TableIdentifier|null $tableName
     * @param HydratorInterface|null $hydrator
     * @return ResultInterface
     */
    protected function update($entity, $where, $tableName = null, HydratorInterface $hydrator = null)
    {
        $this->initialize();
        $tableName = $tableName ?: $this->tableName;

        $sql = $this->getSql()->setTable($tableName);
        $update = $sql->update();

        $rowData = $this->entityToArray($entity, $hydrator);
        $update->set($rowData)
            ->where($where);

        $statement = $sql->prepareStatementForSqlObject($update);

        return $statement->execute();
    }

    /**
     * @param string|array|closure $where
     * @param string|TableIdentifier|null $tableName
     * @return ResultInterface
     */
    protected function delete($where, $tableName = null)
    {
        $tableName = $tableName ?: $this->tableName;

        $sql = $this->getSql()->setTable($tableName);
        $delete = $sql->delete();

        $delete->where($where);

        $statement = $sql->prepareStatementForSqlObject($delete);

        return $statement->execute();
    }

    /**
     * @return string
     */
    protected function getTableName()
    {
        return $this->tableName;
    }

    /**
     * @return object
     */
    public function getEntityPrototype()
    {
        return $this->entityPrototype;
    }

    /**
     * @param object $modelPrototype
     * @return AbstractDbMapper
     */
    public function setEntityPrototype($entityPrototype)
    {
        $this->entityPrototype = $entityPrototype;
        $this->resultSetPrototype = null;
        return $this;
    }

    /**
     * @return Adapter
     */
    public function getDbAdapter()
    {
        return $this->dbAdapter;
    }

    /**
     * @param Adapter $dbAdapter
     * @return AbstractDbMapper
     */
    public function setDbAdapter(Adapter $dbAdapter)
    {
        $this->dbAdapter = $dbAdapter;
        if ($dbAdapter instanceof MasterSlaveAdapterInterface) {
            $this->setDbSlaveAdapter($dbAdapter->getSlaveAdapter());
        }
        return $this;
    }

    /**
     * @return Adapter
     */
    public function getDbSlaveAdapter()
    {
        return $this->dbSlaveAdapter ?: $this->dbAdapter;
    }

    /**
     * @param Adapter $dbAdapter
     * @return AbstractDbMapper
     */
    public function setDbSlaveAdapter(Adapter $dbSlaveAdapter)
    {
        $this->dbSlaveAdapter = $dbSlaveAdapter;
        return $this;
    }

    /**
     * @return HydratorInterface
     */
    public function getHydrator()
    {
        if (!$this->hydrator) {
            $this->hydrator = new ClassMethods(false);
        }
        return $this->hydrator;
    }

    /**
     * @param HydratorInterface $hydrator
     * @return AbstractDbMapper
     */
    public function setHydrator(HydratorInterface $hydrator)
    {
        $this->hydrator = $hydrator;
        $this->resultSetPrototype = null;
        return $this;
    }

    /**
     * @return Sql
     */
    protected function getSql()
    {
        if (!$this->sql instanceof Sql) {
            $this->sql = new Sql($this->getDbAdapter());
        }

        return $this->sql;
    }

    /**
     * @param Sql
     * @return AbstractDbMapper
     */
    protected function setSql(Sql $sql)
    {
        $this->sql = $sql;
        return $this;
    }

    /**
     * @return Sql
     */
    protected function getSlaveSql()
    {
        if (!$this->slaveSql instanceof Sql) {
            $this->slaveSql = new Sql($this->getDbSlaveAdapter());
        }

        return $this->slaveSql;
    }

    /**
     * @param Sql
     * @return AbstractDbMapper
     */
    protected function setSlaveSql(Sql $sql)
    {
        $this->slaveSql = $sql;
        return $this;
    }

    /**
     * Uses the hydrator to convert the entity to an array.
     *
     * Use this method to ensure that you're working with an array.
     *
     * @param object $entity
     * @return array
     */
    protected function entityToArray($entity, HydratorInterface $hydrator = null)
    {
        if (is_array($entity)) {
            return $entity; // cut down on duplicate code
        } elseif (is_object($entity)) {
            if (!$hydrator) {
                $hydrator = $this->getHydrator();
            }
            return $hydrator->extract($entity);
        }
        throw new Exception\InvalidArgumentException('Entity passed to db mapper should be an array or object.');
    }
}
