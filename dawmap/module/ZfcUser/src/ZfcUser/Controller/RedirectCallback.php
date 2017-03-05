<?php

namespace ZfcUser\Controller;

use Zend\Mvc\Application;
use Zend\Mvc\Router\RouteInterface;
use Zend\Mvc\Router\Exception;
use Zend\Http\PhpEnvironment\Response;
use ZfcUser\Options\ModuleOptions;

/**
 * Buils a redirect response based on the current routing and parameters
 */
class RedirectCallback
{

    /** @var RouteInterface  */
    private $router;

    /** @var Application */
    private $application;

    /** @var ModuleOptions */
    private $options;

    /**
     * @param Application $application
     * @param RouteInterface $router
     * @param ModuleOptions $options
     */
    public function __construct(Application $application, RouteInterface $router, ModuleOptions $options)
    {
        $this->router = $router;
        $this->application = $application;
        $this->options = $options;
    }

    /**
     * @return Response
     */
    public function __invoke()
    {
        $routeMatch = $this->application->getMvcEvent()->getRouteMatch();
        $redirect = $this->getRedirect($routeMatch->getMatchedRouteName(), $this->getRedirectUrlFromRequest());

        $response = $this->application->getResponse();
        $response->getHeaders()->addHeaderLine('Location', $redirect);
        $response->setStatusCode(302);
        return $response;
    }
    
    /**
     * Return the redirect from param.
     * First checks GET then POST
     * @return string
     */
    private function getRedirectUrlFromRequest()
    {
    	$request  = $this->application->getRequest();
    	$redirect = $request->getQuery('redirect');
    	if ($redirect && $this->urlWhitelisted($redirect)) {
    		return $redirect;
    	}
    	$redirect = $request->getPost('redirect');
    	if ($redirect && $this->urlWhitelisted($redirect)) {
    		return $redirect;
    	}
    	return false;
    }
    
    /**
     * Checks if a $url is in whitelist
     * / and localhost are always allowed
     *
     * partly snatched from https://gist.github.com/mjangda/1623788
     *
     * @param $url
     * @return bool
     */
    private function urlWhitelisted($url)
    {
    	$always_allowed = array('localhost');
    	//$whitelisted_domains = array_merge($this->options->getWhitelist(), $always_allowed);
    	$whitelisted_domains = ['localhost', 'grab.com', 'agrader.louismakeweb.com', 'a-grader.com'];
    	// Add http if missing(to satisfy parse_url())
    	if (strpos($url, "/") !== 0 && strpos($url, "http") !== 0) {
    		$url = 'http://' . $url;
    	}
    	$domain = parse_url($url, PHP_URL_HOST);
    	if (strpos($url, "/") === 0 || in_array($domain, $whitelisted_domains)) {
    		return true;
    	}
    	foreach ($whitelisted_domains as $whitelisted_domain) {
    		$whitelisted_domain = '.' . $whitelisted_domain;
    		if (strpos($domain, $whitelisted_domain) === (strlen($domain) - strlen($whitelisted_domain))) {
    			return true;
    		}
    	}
    	return false;
    }

    /**
     * Return the redirect from param.
     * First checks GET then POST
     * @return string
     */
    private function getRedirectRouteFromRequest()
    {
        $request  = $this->application->getRequest();
        $redirect = $request->getQuery('redirect');
        if ($redirect && $this->routeExists($redirect)) {
            return $redirect;
        }

        $redirect = $request->getPost('redirect');
        if ($redirect && $this->routeExists($redirect)) {
            return $redirect;
        }

        return false;
    }

    /**
     * @param $route
     * @return bool
     */
    private function routeExists($route)
    {
        try {
            $this->router->assemble(array(), array('name' => $route));
        } catch (Exception\RuntimeException $e) {
            return false;
        }
        return true;
    }

    /**
     * Returns the url to redirect to based on current route.
     * If $redirect is set and the option to use redirect is set to true, it will return the $redirect url.
     *
     * @param string $currentRoute
     * @param bool $redirect
     * @return mixed
     */
    protected function getRedirect($currentRoute, $redirect = false)
    {
        $useRedirect = $this->options->getUseRedirectParameterIfPresent();
    	$urlAllowed = ($redirect && $this->urlWhitelisted($redirect));
        if ($useRedirect && $urlAllowed) {
            return $redirect;
        }

        switch ($currentRoute) {
            case 'zfcuser/register':
            case 'zfcuser/login':
                $route = ($redirect) ?: $this->options->getLoginRedirectRoute();
                return $this->router->assemble(array(), array('name' => $route));
                break;
            case 'zfcuser/logout':
                $route = ($redirect) ?: $this->options->getLogoutRedirectRoute();
                return $this->router->assemble(array(), array('name' => $route));
                break;
            default:
                return $this->router->assemble(array(), array('name' => 'zfcuser'));
        }
    }
}
