<?php
function EnjoyReading_showErr($ErrMsg) {
    header('HTTP/1.0 500 Internal Server Error');
	header('Content-Type: text/plain;charset=UTF-8');
    echo $ErrMsg;
    exit;
}

$bgimg=array(
		array(__('Default','WP-Enjoy-Reading'),get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/default-thumb.png','#fff'),
		array(__('Mid-Autumn','WP-Enjoy-Reading'),get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/autumn-thumb.jpg','url('.get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/autumn.jpg) no-repeat center top #586F52'),
		array(__('bear','WP-Enjoy-Reading'),get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/bear-thumb.jpg','url('.get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/bear.jpg) no-repeat center top #A06229'),
		array(__('love me','WP-Enjoy-Reading'),get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/love_me-thumb.jpg','url('.get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/love_me.jpg) no-repeat center top #E5DBB7'),
		array(__('bear and meme','WP-Enjoy-Reading'),get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/bear_and_meme-thumb.jpg','url('.get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/themes/bear_and_meme.jpg) no-repeat center top #89B4DE')
	);
function EnjoyReading(){
	if($_GET['action'] == 'EnjoyReadingPosts'){
		$jsonArr=array();$_cats='';
		$_offset=$_GET['offset'];
		$_num=$_GET['number'];
		if((int)$_num>35)EnjoyReading_showErr(__('Too many posts!!!','WP-Enjoy-Reading'));
		if(get_option('EnjoyReading_cat_exclude')!=''){
			$exclude_cats=explode(',', get_option('EnjoyReading_cat_exclude'));
			$_cats='-'.trim($exclude_cats[0]);
			for($i=1;$i<count($exclude_cats);$i++)
				$_cats .= ',-'.trim($exclude_cats[$i]);
		}
		if(isset($_GET['catname'])){
			$catname=$_GET['catname'];
			query_posts("showposts=$_num&offset=$_offset&category_name=$catname");
		}if(isset($_GET['cat'])){
			$catid=$_GET['cat'];
			query_posts("showposts=$_num&offset=$_offset&cat=$catid");
		}else
			query_posts("showposts=$_num&offset=$_offset&cat=$_cats");
		global $more;$more=1;
		if(have_posts()){
			while (have_posts()) :the_post();
				if(EnjoyReading_get_img())$imgurl=EnjoyReading_get_img();
				else $imgurl='';
				$json=array("posturl"=>get_permalink(),"title"=>get_the_title(),"cat"=>get_the_category_list(' ,'),"time"=>get_the_time('l, F j, Y'),"com_number"=>get_comments_number(),"id"=>get_the_ID(),"thumd"=>$imgurl,"excerpt"=>EnjoyReading_substr(strip_tags(get_the_excerpt()),140),"content"=>apply_filters('the_content', get_the_content()));
				$jsonArr[]=$json;
			endwhile;echo 'WER-'.json_encode($jsonArr).'-WER';
		}else{
			EnjoyReading_showErr(__('There is no post.','WP-Enjoy-Reading'));
		}die();
	}else if($_GET['action'] == 'EnjoyReadingCmts'){
		if(empty($_GET['postid']))EnjoyReading_showErr(__('The id is not exist.','WP-Enjoy-Reading'));
		$_postId=$_GET['postid'];
		$_offset=$_GET['offset'];
		$_num=$_GET['number'];
		EnjoyReading_LoadComment($_postId,$_num,$_offset);
		die();
	}else if($_GET['action'] == 'getAllThemes'){
		global $bgimg;
		echo 'WER-'.json_encode($bgimg).'-WER';
		die();
	}else if($_GET['action'] == 'EnjoyReadingIndex'){
		echo '<div id="WER-wrapper">'.
				'<div id="WER-header">'.
					'<div id="WER-title">'.
						'<h1><a title ="'.get_bloginfo('description').'" href="'.get_option('home').'/">'.
								get_bloginfo('name').
							'</a>'.
						'</h1>'.
						'<div class="WER-descrip">'.
							'<small>'.get_bloginfo('description').'</small>'.
						'</div>'.
						'<a href="javascript:void(0);" id="WER-setTheme" title="'.__('change theme','WP-Enjoy-Reading').'"></a>'.
					'</div>'.
				'</div>'.
				'<div class="WER-AnimateCon"><div id="WER-container">'.
				'</div></div>'.
				'<div id="WER-footer">'.
					'Copyright&#169; 2010 '.get_bloginfo('name').'. <a href="http://qiqi.boy.im/ajax#page=2538">EnjoyReading</a>'.
				'</div>'.
			'</div>';
		die();
	}else if($_GET['action'] == 'EnjoyReadingOptions'){
		global $user_ID, $bgimg;
		$output=array(
						"uname"=>(is_user_logged_in()) ? get_the_author_meta('user_nicename', $user_ID) : stripslashes($_COOKIE['comment_author_'.COOKIEHASH]),
						"umail"=>(is_user_logged_in()) ? get_the_author_meta('user_email', $user_ID) : stripslashes($_COOKIE['comment_author_email_'.COOKIEHASH]),
						"uurl"=>(is_user_logged_in()) ? get_the_author_meta('user_url', $user_ID) : stripslashes($_COOKIE['comment_author_url_'.COOKIEHASH]),
						"isuser"=>(is_user_logged_in()) ? 1 : 0,
						"cmts"=>get_option('EnjoyReading_comments')!=''?(int)get_option('EnjoyReading_comments'):10,
						"from"=>__('From: ', 'WP-Enjoy-Reading'),
						"timefrom"=>__('Time: ', 'WP-Enjoy-Reading'),
						"postat"=>__('Time: ', 'WP-Enjoy-Reading'),
						"navbe"=>__('page ', 'WP-Enjoy-Reading'),
						"navaf"=>__(' ', 'WP-Enjoy-Reading'),
						"newer"=>__('newer', 'WP-Enjoy-Reading'),
						"older"=>__('older', 'WP-Enjoy-Reading'),
						"showcmt"=>__('Comments', 'WP-Enjoy-Reading'),
						"morecmt"=>__('Load more comments', 'WP-Enjoy-Reading'),
						"nocmt"=>__('There is no comments.', 'WP-Enjoy-Reading'),
						"str0"=>__('loading Enjoy Reading files, please wait...', 'WP-Enjoy-Reading'),
						"str1"=>__('loading EnjoyReading page, please wait...', 'WP-Enjoy-Reading'),
						"str2"=>__('EnjoyReading page load success! Initialize...', 'WP-Enjoy-Reading'),
						"str3"=>__('loading request data, please wait...', 'WP-Enjoy-Reading'),
						"str4"=>__('Request timed out, or post request data too large, click the "Reload" try again!', 'WP-Enjoy-Reading'),
						"str5"=>__('Say something...', 'WP-Enjoy-Reading'),
						"str6"=>__('change', 'WP-Enjoy-Reading'),
						"str7"=>__('is submiting...', 'WP-Enjoy-Reading'),
						"str8"=>__('Please check your name!', 'WP-Enjoy-Reading'),
						"str9"=>__('Please check your email!', 'WP-Enjoy-Reading'),
						"str10"=>__('Please check your comment!', 'WP-Enjoy-Reading'),
						"str11"=>__('Please check your input!', 'WP-Enjoy-Reading'),
						"str12"=>__('Welcome back', 'WP-Enjoy-Reading'),
						"str13"=>__('Submit Comment', 'WP-Enjoy-Reading'),
						"str14"=>__('submit successfully!', 'WP-Enjoy-Reading'),
						"bgimg"=>((isset($_COOKIE['ajax_theme'])&&isset($bgimg[(int)$_COOKIE['ajax_theme']]))?$bgimg[(int)$_COOKIE['ajax_theme']][2]:(get_option("EnjoyReading_theme")!==0&&isset($bgimg[get_option("EnjoyReading_theme")])?$bgimg[get_option("EnjoyReading_theme")][2]:$bgimg[mt_rand(1,count($bgimg)-1)][2]))
		);
		echo 'WER-'.json_encode($output).'-WER';
		die();
	}else if($_POST['action'] == 'EnjoyReadingSubmit'&&'POST' == $_SERVER['REQUEST_METHOD']){
		global $wpdb;
		require_once(dirname(__FILE__)."/../../../../wp-load.php");
		nocache_headers();
		$comment_post_ID = (int) $_POST['comment_post_ID'];
		$status = $wpdb->get_row( $wpdb->prepare("SELECT post_status, comment_status FROM $wpdb->posts WHERE ID = %d", $comment_post_ID) );
		if ( empty($status->comment_status) ) {
			do_action('comment_id_not_found', $comment_post_ID);
			EnjoyReading_showErr(__('The post you are trying to comment on does not currently exist in the database.'));
		} elseif ( !comments_open($comment_post_ID) ) {
			do_action('comment_closed', $comment_post_ID);
			EnjoyReading_showErr(__('Sorry, comments are closed for this item.'));	
		} elseif ( in_array($status->post_status, array('draft', 'pending') ) ) {
			do_action('comment_on_draft', $comment_post_ID);
			EnjoyReading_showErr(__('The post you are trying to comment on has not been published.'));	
		} else {
			do_action('pre_comment_on_post', $comment_post_ID);
		}
		$comment_author       = ( isset($_POST['author']) )  ? trim(strip_tags($_POST['author'])) : null;
		$comment_author_email = ( isset($_POST['email']) )   ? trim($_POST['email']) : null;
		$comment_author_url   = ( isset($_POST['url']) )     ? trim($_POST['url']) : null;
		$comment_content      = ( isset($_POST['comment']) ) ? trim($_POST['comment']) : null;	
		$user = wp_get_current_user();
		if (!is_user_logged_in() && (get_option('comment_registration') || 'private' == $status->post_status) )
			EnjoyReading_showErr(__('Sorry, you must be logged in to post a comment.'));	
		$comment_type = '';
		if ( get_option('require_name_email') && !$user->ID ) {
			if ( 6 > strlen($comment_author_email) || '' == $comment_author )
				EnjoyReading_showErr( __('Error: please fill the required fields (name, email).'));	
			elseif ( !is_email($comment_author_email))
				EnjoyReading_showErr(__('Error: please enter a valid email address.'));	
		}
		if ( '' == $comment_content )
			EnjoyReading_showErr(__('Error: please type a comment.'));	
		$dupe = "SELECT comment_ID FROM $wpdb->comments WHERE comment_post_ID = '$comment_post_ID' AND ( comment_author = '$comment_author' ";
		if ( $comment_author_email ) $dupe .= "OR comment_author_email = '$comment_author_email' ";
		$dupe .= ") AND comment_content = '$comment_content' LIMIT 1";
		if ( $wpdb->get_var($dupe) ) {
			EnjoyReading_showErr(__('Duplicate comment detected; it looks as though you&#8217;ve already said that!'));
		}
		if ( $lasttime = $wpdb->get_var( $wpdb->prepare("SELECT comment_date_gmt FROM $wpdb->comments WHERE comment_author = %s ORDER BY comment_date DESC LIMIT 1", $comment_author) ) ) { 
		$time_lastcomment = mysql2date('U', $lasttime, false);
		$time_newcomment  = mysql2date('U', current_time('mysql', 1), false);
		$flood_die = apply_filters('comment_flood_filter', false, $time_lastcomment, $time_newcomment);
		if ( $flood_die ) {
			EnjoyReading_showErr(__('You are posting comments too quickly.  Slow down.'));
			}
		}
		$comment_parent = isset($_POST['comment_parent']) ? absint($_POST['comment_parent']) : 0;
		$commentdata = compact('comment_post_ID', 'comment_author', 'comment_author_email', 'comment_author_url', 'comment_content', 'comment_type', 'comment_parent', 'user_ID');
		$comment_id = wp_new_comment( $commentdata );
		$comment = get_comment($comment_id);
		if ( !$user->ID ) {
			$comment_cookie_lifetime = apply_filters('comment_cookie_lifetime', 30000000);
			setcookie('comment_author_' . COOKIEHASH, $comment->comment_author, time() + $comment_cookie_lifetime, COOKIEPATH, COOKIE_DOMAIN);
			setcookie('comment_author_email_' . COOKIEHASH, $comment->comment_author_email, time() + $comment_cookie_lifetime, COOKIEPATH, COOKIE_DOMAIN);
			setcookie('comment_author_url_' . COOKIEHASH, esc_url($comment->comment_author_url), time() + $comment_cookie_lifetime, COOKIEPATH, COOKIE_DOMAIN);
		}?>
	<div class="WER-commentcontent">
		<div class="WER-author_avatar">
			<?php echo get_avatar($comment,$size='32'); ?>
		</div>
		<div class="WER-author_name">
			<a class="WER-newCom" href="<?php echo get_permalink($comment->comment_post_ID)."#comment-".$comment->comment_ID; ?>"><?php echo get_comment_author(); ?></a>
		</div>
		<div class="WER-comment_content"><?php echo $comment->comment_content; ?></div>
		<?php if ($comment->comment_approved == '0') : ?>
			<a href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ) ?>"><?php _e('Your comment is awaiting moderation.') ?></a>
		<?php endif; ?>
	</div>
	<?php die();
	}
}
add_action('init', 'EnjoyReading');

function wp_EnjoyReading_comments_get ($postid,$limitclause=""){
		global $wpdb;
		$postId="'".$postid."'";
		$q = "SELECT ID, post_title, comment_ID, comment_date, comment_post_ID, comment_parent, comment_author, comment_author_email, comment_author_url, comment_content FROM $wpdb->comments LEFT OUTER JOIN $wpdb->posts ON ($wpdb->comments.comment_post_ID = $wpdb->posts.ID) WHERE comment_approved = '1' AND comment_type = '' AND post_password = '' AND comment_post_ID = $postId ORDER BY comment_date_gmt DESC $limitclause";
		return $wpdb->get_results($q);
}
function EnjoyReading_LoadComment ($postId,$number,$start){
		$output = array();$comlist=array();$hasmore=array(0,0);
		$limitclause="LIMIT " . $start . "," . ($number+1);
		$comments = wp_EnjoyReading_comments_get ($postId,$limitclause);
		$hasolder=count($comments) - $number;
		if($hasolder > 0){
			array_pop($comments);
			$hasmore[0]=1;
			$hasmore[1]=$number+$start;
		}
		foreach ($comments as $comment) {
			$comment_depth = 1;
			$tmp_c = $comment;$comment_parent;
			while($tmp_c->comment_parent != 0){
				$comment_depth++;
				$tmp_c = get_comment($tmp_c->comment_parent);
			}
			if($comment_depth < get_option('thread_comments_depth'))
				$comment_parent=$comment->comment_ID;
			else $comment_parent=get_comment($comment->comment_parent)->comment_ID;
			$rc_content=$comment->comment_content;
			$date_format = __('Y/m/d', 'WP-Enjoy-Reading');
			$time_format = __('H:i', 'WP-Enjoy-Reading');
			$datetime = sprintf(__('%1$s - %2$s', 'WP-Enjoy-Reading'), mysql2date($date_format, $comment->comment_date), mysql2date($time_format, $comment->comment_date));
			$comlist[] = array("avatar"=>get_avatar($comment->comment_author_email, 32),"postid"=>$comment->comment_post_ID,"parentid"=>$comment_parent,"comurl"=>get_comment_link($comment->comment_ID),"comid"=>$comment->comment_ID,"comdate"=>$datetime,"title"=>$comment->post_title,"comauthor"=>$comment->comment_author,"content"=>convert_smilies($rc_content));
		}
			$output[] = $comlist;
			$output[] = $hasmore;
			echo 'WER-'.json_encode($output).'-WER';
}
function EnjoyReading_get_img() {
		global $post;
		$the_img = '';
		preg_match_all('/<img.+src=([^>]+?) /i', $post->post_content, $matches);
		$the_img = $matches [1] [0];
		if(empty($the_img)){
		return	false;	
		}else{
		return $the_img;
		}
}
function EnjoyReading_substr($str,$length){
		$pa = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/";
		preg_match_all($pa, $str, $t_str);
		if(count($t_str[0]) > $length) {
			$ellipsis = '...';
			$str = join('', array_slice($t_str[0], 0, $length)) . $ellipsis;
		}
		return $str;
}

add_action('admin_menu', 'EnjoyReading_add_options');
function wp_Enjoy_Reading($EnjoyReading_name=false){
	if(!$EnjoyReading_name)$EnjoyReading_name=__('Enjoy Reading', 'WP-Enjoy-Reading');
	echo '<a href="?action=startEnjoyReading" id="EnjoyReadingStart">'.$EnjoyReading_name.'</a>';
}
function EnjoyReading_add_options() {
	add_options_page('Enjoy Reading', __("Enjoy Reading","WP-Enjoy-Reading"), 8, __FILE__, 'EnjoyReading_the_options');
}
function EnjoyReading_addScript(){
	$script = '<script type="text/javascript" src="' . get_bloginfo('wpurl') . '/wp-content/plugins/wp-enjoy-reading/js/base.min.js"></script>';
	echo $script;
}
add_action ('wp_head', 'EnjoyReading_addScript');
class EnjoyReading_widget extends WP_Widget{
	function EnjoyReading_widget(){
		$widget_des = array('classname'=>'wp_rc_reply','description'=>__('Just Enjoy Reading For Your Wordpress Blog.', 'WP-Enjoy-Reading'));
		$this->WP_Widget(false,__('Enjoy Reading', 'WP-Enjoy-Reading'),$widget_des);
	}
	function form($instance){
		$instance = wp_parse_args((array)$instance,array(
		'title'=>__('Enjoy Reading', 'WP-Enjoy-Reading'),
		'linktext'=>__('Click here to Enjoy Reading', 'WP-Enjoy-Reading')));
		echo '<p><label for="'.$this->get_field_name('title').'">'.__('widget title: ', 'WP-Enjoy-Reading').'<input style="width:200px;" name="'.$this->get_field_name('title').'" type="text" value="'.htmlspecialchars($instance['title']).'" /></label></p>';
		echo '<p><label for="'.$this->get_field_name('linktext').'">'.__('The text of "Enjoy Reading" link: ', 'WP-Enjoy-Reading').'<input style="width:200px;" name="'.$this->get_field_name('linktext').'" type="text" value="'.htmlspecialchars($instance['linktext']).'" /></label></p>';
	}
	function update($new_instance,$old_instance){
		$instance = $old_instance;
		$instance['title'] = strip_tags(stripslashes($new_instance['title']));
		$instance['linktext'] = strip_tags(stripslashes($new_instance['linktext']));
		return $instance;
	}
	function widget($args,$instance){
		extract($args);
		$title = apply_filters('widget_title',empty($instance['title']) ? __('Enjoy Reading', 'WP-Enjoy-Reading') : $instance['title']);
		$linktext = apply_filters('widget_title',empty($instance['linktext']) ? __('Click here to Enjoy Reading', 'WP-Enjoy-Reading') : $instance['linktext']);
		echo '<li id="EnjoyReading_widget" class="widget"><h3>'.$title.'</h3>';
		echo '<a href="?action=startEnjoyReading" id="EnjoyReadingStart">'.$linktext.'</a>';
		echo '</li>';
	}
}
function EnjoyReading_widget_init(){
	register_widget('EnjoyReading_widget');
}
add_action('widgets_init','EnjoyReading_widget_init');
?>