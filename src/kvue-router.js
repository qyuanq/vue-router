// 这里为什么不用 import Vue from 'vue';
// 打包库的时候会把上面vue打包进去
// 所以定义一个变量，给它赋值
let Vue;
class VueRouter{
    constructor(options){
        this.$options = options;
        // 创建一个path和路由配置（route）映射关系
        this.routeMap = {};
        // 将来当前路径current需要响应式
        // 利用Vue响应式原理可以做到这一点
        // 创建一个Vue实例，保存实例去管理current
        this.app = new Vue({
            data:{
                current:"/"
            }
        })
    }
    init(){
        //绑定浏览器事件
        this.bindEvents();
        //解析路由配置
        this.createRouterMap(this.$options);
        // 创建router-link和router-view
        this.initComponent();
    }
    bindEvents(){
        window.addEventListener("hashchange",this.onHashChange.bind(this)); //hash模式   地址栏带#
        window.addEventListener("load",this.onHashChange.bind(this));   //bind(this)修正this指向
    }
    onHashChange(){
        // http://localhost/#/home  slice(1)取 /home
        this.app.current = window.location.hash.slice(1) || '/';
    }
    createRouterMap(options){
        // ['/home']: {path:'/home',component:Home}
        options.routes.forEach(item => {
            this.routeMap[item.path] = item;
        })
    }
    initComponent(){
        // 声明两个全局组件
        Vue.component('router-link',{
            props:{
                to:String
            },
            render(h){
            // 目标是：<a :href="to">xxx</a>
            // return <a href="this.to">{this.$slots.default}</a>   jsx
            return h('a', {attrs:{href: '#'+this.to}}, this.$slots.default)
            }
        })

         // hash -> current -> render
        Vue.component('router-view',{
            // 箭头函数能保留this指向，这里指向VueRouter实例
            render:h => {
                var Comp = this.routeMap[this.app.current].component;
                return h(Comp);
            }
        })
    }
}

// Vue.use(VueRouter)引入VueRouter插件，Vue把自己传给install方法
// 这里把VueRouter变为插件，只要实现install方法就能变为插件。
VueRouter.install=function(_Vue){   //这里_Vue  接收的是Vue实例（vue的构造函数）
    Vue = _Vue;     //将接收到的Vue实例保存，完成了最上面定义变量的赋值。
    Vue.mixin({ //混入 就是 vue扩展
        beforeCreate(){
            // 这里的代码会在外面初始化的时候调用
            // 这样我们就实现了 vue扩展
            // this是谁？   vue组件实例， beforeCreate会在所有组件创建中都会执行
            // 但是这里只希望根组件执行一次（this.$options.router  只有根组件实例化对象配置中有router,所以说为什么要在根组件配置中挂router）
            if(this.$options.router){
                Vue.prototype.$router = this.$options.router;
                // 路由初始化
                this.$options.router.init();
            }
        }
    })
    
}
export default VueRouter
