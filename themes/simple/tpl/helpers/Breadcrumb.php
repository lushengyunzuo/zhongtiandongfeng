<?php

if(!defined('APP_KEY')) { exit('Access Denied'); }

class Helper_Breadcrumb implements Suco_Helper_Interface
{
  protected $src;

  public static function callback($args)
  {
    return new self($args[0], $args[1]);
  }

  public function output()
  {
    $paths = M('Admin_Menu')->getCurNote()
      ->getPath();

    $url = H('Url', 'controller=index');
    $html = '<ul class="breadcrumb sui-breadcrumb">'
      .'<li><a href="'.$url.'"><i class="fa fa-home"></i>&nbsp;&nbsp;控制台</a></li>';
    foreach($paths as $row) {
      $url = H('Url', 'controller=admin_menu&action=redirect&id='.$row['id']);
      $html.= '<li><a href="'.$url.'">'.$row['name'].'</a></li>';
    }
    $html.= '</ul>';

    return $html;
  }

  public function __toString()
  {
    return $this->output();
  }
}