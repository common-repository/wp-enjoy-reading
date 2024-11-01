=== WP Enjoy Reading ===
Contributors: QiQiBoY
Author Homepage: http://www.qiqiboy.com
Tags: wordpress, ajax, read, enjoy reading
Requires at least: 2.7
Tested up to: 3.0.1
Stable tag: 1.2.2

It's a plugin, but it is also a very cool theme, all ajax funtions. Just enjoy reading for your wordpress weblog. It could make you focus on the blog content, and enjoy the fun from reading posts. 

== Description ==
*It's a wordpress plug-in, but it's also a wordpress theme.<br>
*Just enjoy reading for your wordpress weblog.<br>
*It could make you focus on the blog content, and enjoy the fun from reading posts.<br>
*It provides a wonderful reading experience you have not before.<br>
*It is really fantastic, I can not express in words.<br>
*But you can preview it with visiting "http://www.qiqiboy.com/?preview_theme1=ajaxPaled".
*You can also view the screenshot.<br>
*Contact me: imqiqiboy#gmail.com or http://www.qiqiboy.com/contact<br>
*基于全站ajax构建的一款以插件形式发布的wordpress主题。<br>
*它提供了你一种前所未有，闻所未闻的wordpress主题形式，让你专注于博客内容，尽享阅读博文的乐趣。<br>
*就用它来享受美妙的wordpress阅读吧<br>
*它提供了一种你之前从未有过的wordpress使用体验。<br>
*它实在是太棒了，我无法用言语向您表述更多。<br>
*但是你可以到"http://www.qiqiboy.com/?preview_theme1=ajaxPaled"来一窥它的大概面貌.
*你也可以查看截图。
*提供技术支持及咨询，联系邮件请发【imqiqiboy#gmail.com】或者在我博客【http://www.qiqiboy.com】留言<br>
= version 1.2.0 =
add theme switch function!<br>
新增皮肤切换功能，炫彩主题任意换！详见截图效果<br>
add submit comments function.<br>
新增阅读模式发表评论功能！<br>
新增分类ajax加载。
= How to use || 如何使用 =
Go to widgets page to add the widget to your sidebar. Also you can use function <code>&lt;?php wp_Enjoy_Reading(display_text); ?></code> at the place you want to show the reading link.<br>
直接向边栏添加【尽享阅读】小工具或者调用<code>&lt;?php wp_Enjoy_Reading(display_text); ?></code>来在页面上生成所需的a链接节点。
== Installation ==

1. Download the plugin archive and expand it (you've likely already done this).
2. Put the 'WP Enjoy Reading' directory into your wp-content/plugins/ directory.
3. Go to the Plugins page in your WordPress Administration area and click 'Activate' for WP Enjoy Reading.
4. Go to the Enjoy Reading Options page (Settings > Enjoy Reading Option).
5. Go to widgets page to add the widget to your sidebar.
   Also you can use function <code>&lt;?php wp_Enjoy_Reading(display_text); ?></code> at the place you want to show the reading link.

下载插件，上传到插件目录，在后台管理中激活插件，到设置页面进行简单设置，然后在小工具页面向边栏添加边栏回复小工具即可。
当然，你也可以直接调用阅读入口链接生成函数<code>&lt;?php wp_Enjoy_Reading(display_text); ?></code>，放到你要显示此链接的地方即可。<br>

== Screenshots ==

1. 使用效果截图：阅读模式首页
2. 前台皮肤切换效果

== Changelog ==
= 1.2.2 =
2010/11/12
修正未设置固定链接的博客的分类获取错误问题;
修正翻页到最后一页后，向前翻页再向后翻的页码错误bug;
修正css一处继承问题。
2010/11/03
新增法语语言包。
皮肤内置于插件里。
= 1.2.0 =
2010/10/31
新增皮肤切换功能，支持后台设置默认皮肤。
= 1.1.12 =
2010/10/19
增加文章发表时间的显示。
= 1.1.11 =
2010/10/18
support IE6 browser.<br>
修正css兼容性，支持IE6.
= 1.1.10 =
2010/10/17
修改分页切换逻辑。
= 1.1.9 =
2010/10/17
fixed a bug in IE browser.<br>
修复IE下一个小问题。
= 1.1.8 =
2010/10/17
新增分类ajax加载功能。add category ajax load.
= 1.1.6 =
2010/10/16
fixed a bug
= 1.1.5 =
2010/10/15
新增分类排除选项，可通过输入分类id来排除某一分类的显示
= 1.1.3 =
2010/10/14
fixed when you input comment and use the arrow keys to switch the cursor, but clashed with article switch.<br>
修正当输入评论时使用方向键移动光标时与文章切换功能冲突的问题。评论输入添加tab键支持。
fixed a bug
= 1.1.2 =
fixed a bug
= 1.1.1 =
add page switch animate,
增加页面切换的一个动画效果，增加首页方向键切换功能，导航栏的的更新
= 1.1.0 =
add submit comments function.<br>
新增阅读模式发表评论功能！
= 1.0.3 =
2010/10/11
添加自定义显示链接文本
= 1.0.2 =
2010/10/11
Resolve the conflict with some Plug<br>
解决与一些插件的优先级冲突问题。<br>
解决一些流氓插件强行将自己的代码挂载到wp enjoy reading的数据响应中的问题。
= 1.0.1 =
2010/10/11
解决一些文章无排版问题。
= 1.0 =
2010/08/20
插件开发完毕，上线。