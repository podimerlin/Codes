<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */
return array(
    'db' => array(
        'driver' => 'Pdo',
        'dsn' => 'mysql:dbname=grabwork_dawmap;host=localhost',
        'driver_options' => array(
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
        )
    ),
    'service_manager' => array(
        'factories' => array(
            'Zend\Db\Adapter\Adapter' => 'Zend\Db\Adapter\AdapterServiceFactory',
            'ZendCacheStorageFactory' => function () {
                return \Zend\Cache\StorageFactory::factory([
                    'adapter' => [
                        'name' => 'filesystem',
                        'options' => [
                            'ttl' => 604800,
                            'dirLevel' => 2,
                            'cacheDir' => 'data/cache',
                            'dirPermission' => 0755,
                            'filePermission' => 0666,
                            'namespaceSeparator' => '-db-'
                        ]
                    ],
                    'plugins' => array(
                        'serializer'
                    )
                ]);
            }
        ),
        'aliases' => array(
            'cache' => 'ZendCacheStorageFactory',
        ),
    )
);
