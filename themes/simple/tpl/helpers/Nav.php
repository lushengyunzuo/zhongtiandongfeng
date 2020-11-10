<?php

if(!defined('APP_KEY')) { exit('Access Denied'); }

class Helper_Nav implements Suco_Helper_Interface
{
  protected $src;

  public static function callback($args)
  {
    return new self($args[0], $args[1]);
  }

  public function output()
  {
    $admin = M('Admin')->getCurUser();
    $paths = M('Admin_Menu')->getCurNote()->getPath();
    $nav = M('Admin_Menu')->select()
      ->order('rank ASC')
      ->fetchRows()
      ->toTree();

    return '<ul class="nav">'.$this->showMenu($nav, $paths->toArray(), $admin).'</ul>';
  }

  public function showMenu($arr, $paths, $user) {
    $html = '';
    foreach ($arr as $row) {
      $allow = explode(',', $row['allow_group']);
      if (!$row['is_enabled']) continue;
      if ($row['allow_group'] && @!in_array($user['group_id'], $allow)) continue;
      $url = H('Url', 'controller=admin_menu&action=redirect&id='.$row['id']);
      $opened = isset($paths[$row['id']]) ? 'active open' : '';
      if ($row['childs_num']) {
        $html .= '<li class="'.$opened.' has-childs"><a href="'.$url.'">';
        if ($row['icon']) { $html .= '<i class="fa fa-'.$row['icon'].' fa-fw"></i> '; }
        $html .= '<span class="menu-text">'.$row['name'].'</span>';
      } else {
        $html .= '<li class="'.$opened.'"><a href="'.$url.'">';
        if ($row['icon']) { $html .= '<i class="fa fa-'.$row['icon'].' fa-fw"></i> '; }
        $html .= '<span class="menu-text">'.$row['name'].'</span>';
      }
      $html .= '</a>';
      if (isset($row['childnotes'])) {
        $html .= '<ul id="snv-'.$row['id'].'" class="nav" role="collapse">'.$this->showMenu($row['childnotes'], $paths, $user).'</ul>';
      }
    }
    return $html;
  }

  public function __toString()
  {
    return $this->output();
  }
}

