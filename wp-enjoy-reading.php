<?php
/*
Plugin Name: WP Enjoy Reading
Plugin URI: http://www.qiqiboy.com/plugins/
Tags: wordpress, ajax, read, enjoy reading
Description: Just enjoy reading for your wordpress weblog. It could make you focus on the blog content, and enjoy the fun from reading posts. 
Version: 1.2.2
Author: QiQiBoY
Author URI: http://www.qiqiboy.com
*/
load_plugin_textdomain('WP-Enjoy-Reading', false, basename(dirname(__FILE__)) . '/lang');
require_once(dirname(__FILE__).'/func/function.php');
function EnjoyReading_the_options() {
?>
<div class="wrap">

	<h2><?php _e('WP-Enjoy-Reading Options','WP-Enjoy-Reading');?></h2>
	<b><?php _e('How to use this plug-in?','WP-Enjoy-Reading');?></b><br><br>
	<?php _e('1.Go to widgets page to add the widget to your sidebar.','WP-Enjoy-Reading');?><br>
	<?php _e('2.use the function ','WP-Enjoy-Reading');?><code>&lt;?php wp_Enjoy_Reading(display_text); ?></code><?php _e(' to custom the posts display position.','WP-Enjoy-Reading');?><br>
	<form method="post" action="options.php">
		<?php wp_nonce_field('update-options'); ?>
		
		<h3><?php _e('Some configuration:','WP-Enjoy-Reading');?></h3>
		
		<table class="form-table">
			<tr valign="top">
			<th scope="row"><?php _e('Not displayed cats ID','WP-Enjoy-Reading');?></th>
			<td><input type="text" name="EnjoyReading_cat_exclude" value="<?php echo get_option('EnjoyReading_cat_exclude'); ?>" /><?php _e('(use \',\' to separate more than one cat, eg:216,345)','WP-Enjoy-Reading');?></td>
			</tr>
			
			<tr valign="top">
			<th scope="row"><?php _e('comments number(dt: 10)','WP-Enjoy-Reading');?></th>
			<td><input type="text" name="EnjoyReading_comments" value="<?php echo get_option('EnjoyReading_comments'); ?>" /><?php _e('Each time the number of comments to load(when click "load more comments" link)','WP-Enjoy-Reading');?></td>
			</tr>
			
			<tr valign="top">
			<th scope="row"><?php _e('Choose the default theme:', 'WP-Enjoy-Reading'); ?></th>
			<td><select style="width:180px;text-align:center" name="EnjoyReading_theme">
				<?php global $bgimg;
					for($i=0;$i<count($bgimg);$i++){
						echo '<option value='.$i.' ';
						if(get_option("EnjoyReading_theme")==$i) echo "selected='selected'";
						echo '>'.$bgimg[$i][0].'</option>';
					}
				?>
			</select></td>
		</tr>
		</table>
		<div>
		<h3><?php _e('Your all categorys:','WP-Enjoy-Reading');?></h3>
			<?php $cat_ids = get_terms( 'category', 'fields=ids&get=all' );
				$count=1;
				foreach ($cat_ids as $cat_id){
					echo get_the_category_by_ID($cat_id).'(id: '.$cat_id.'),&#160;&#160;&#160;&#160;&#160;';
					if(!($count++%4))echo '<br>';
				}
			?>
		</div>
		<a style="color:#ff0000" href="http://twitter.com/qiqiboy"><h3><?php _e('Follow me on Twitter: @qiqiboy ','WP-Enjoy-Reading');?></h3></a>
		<input type="hidden" name="action" value="update" />
		<input type="hidden" name="page_options" value="EnjoyReading_theme,EnjoyReading_cat_exclude,EnjoyReading_comments" />

		<p class="submit">
		<input type="submit" name="Submit" value="<?php _e('Save Changes','WP-Enjoy-Reading') ?>" />
		</p>

	</form>
</div>

<?php
}
?>