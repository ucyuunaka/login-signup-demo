// LoginSignupSystem 模块化封装
const LoginSignupSystem = (function($) {
    // 配置选项，使用默认值
    let config = {
        defaultAvatarUrl: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/22043/avatar.jpg",
        welcomeTemplate: {
            login: "欢迎回来，{username}!",
            signup: "欢迎加入，{username}!"
        },
        generalWelcomeText: "嗨，别来无恙",
        autoInit: true
    };
    
    // 添加操作类型跟踪变量
    let isLoginOperation = true; // 默认为登录操作
    
    // 创建一个Promise包装的延时函数，用于替代嵌套的setTimeout
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 初始化表单状态
    function initFormState() {
        $('#signup-form').addClass('form-flip-out');
        
        // 检测浏览器
        if (navigator.userAgent.toLowerCase().match(/firefox/)) {
            $('.browser-warning').removeClass('hidden');
            delay(6000).then(() => {
                $('.browser-warning').addClass('hidden');
            });
        }
    }
    
    // ================ 表单切换通用逻辑 ================
    // 绑定事件监听器
    function bindEventListeners() {
        $('#to-signup').click(function(e) {
            e.preventDefault();
            switchForm('login', 'signup');
        });
        
        $('#to-login').click(function(e) {
            e.preventDefault();
            switchForm('signup', 'login');
        });
        
        // 登录表单输入验证
        setupInputValidation('.login-email', 'icon-paper-plane');
        setupInputValidation('.login-password', 'icon-lock');
        
        // 登录表单阶段转换
        setupFormStageTransition(
            '.login-form .next-button.email', 
            '.login-form .email-section', 
            '.login-form .password-section', 
            "登录：NetID输入完成"
        );
        
        // 登录表单完成处理
        $('.login-form .next-button.password').click(async function(){
            await handleFormSuccess(
                '登录', 
                '.login-form .password-section', 
                '.login-form .login-success', 
                '.login-email'
            );
        });
        
        // 注册表单输入验证
        setupInputValidation('.signup-email', 'icon-paper-plane');
        setupInputValidation('.signup-password', 'icon-lock');
        setupInputValidation('.repeat-password', 'icon-repeat-lock');
        
        // 注册表单阶段转换
        setupFormStageTransition(
            '.signup-form .next-button.signup-email', 
            '.signup-form .email-section', 
            '.signup-form .password-section', 
            "注册：NetID输入完成"
        );
        
        setupFormStageTransition(
            '.signup-form .next-button.signup-password', 
            '.signup-form .password-section', 
            '.signup-form .repeat-password-section', 
            "注册：密码输入完成"
        );
        
        // 注册表单完成处理
        $('.signup-form .next-button.repeat-password').click(async function(){
            await handleFormSuccess(
                '注册', 
                '.signup-form .repeat-password-section', 
                '.signup-form .signup-success', 
                '.signup-email'
            );
        });
        
        // 重置动画绑定
        $('.trigger-anim-replay').click(function() {
            resetAnimation();
        });
    }
    
    // 通用表单切换函数
    async function switchForm(fromType, toType) {
        isLoginOperation = (toType === 'login'); // 更新操作类型
        const fromForm = $(`#${fromType}-form`);
        const toForm = $(`#${toType}-form`);
        
        // 当前表单翻转隐藏
        fromForm.removeClass('form-flip-in').addClass('form-flip-out');
        
        // 等待翻转动画完成
        await delay(600);
        
        fromForm.addClass('hidden');
        toForm.removeClass('hidden');
        
        // 给浏览器一点时间处理DOM变化
        await delay(50);
        
        toForm.removeClass('form-flip-out').addClass('form-flip-in');
        if (toType === 'signup') {
            $('body').addClass('signup-mode');
        } else {
            $('body').removeClass('signup-mode');
        }
        
        // 动画完成后重置表单
        await delay(600);
        resetForms(false); // 传递false参数表示不重置动画类
    }
    
    // 修改resetForms函数，添加参数控制是否重置动画类
    function resetForms(resetAnimation = true) {
        // 重置表单状态
        $('.input-section').removeClass('fold-up');
        $('.email-section').removeClass('fold-up');
        $('.password-section').addClass('folded');
        $('.repeat-password-section').addClass('folded');
        $('.icon-paper-plane, .icon-lock, .icon-repeat-lock').removeClass('next');
        $('.success').css("marginTop", "-75px");
        $('input').val('');
        
        // 仅当resetAnimation为true时重置动画类
        if (resetAnimation) {
            $('#window').removeClass('flip');
            $('.login-form, .signup-form').removeClass('form-flip-in form-flip-out');
            // 重置欢迎页面元素动画状态
            $('.welcome-element').css({
                'opacity': '0',
                'transform': 'translateY(-30px)'
            });
        }
    }
    
    // ================ 通用表单输入处理 ================
    
    // 鼠标悬停效果 - 通用部分
    function setupHoverEffects() {
        $('.next-button').hover(function(){
            $(this).css('cursor', 'pointer');
        });
    }
    
    // 设置输入字段验证和图标变化 - 通用函数
    function setupInputValidation(inputSelector, iconClass) {
        $(inputSelector).on("change keyup paste", function(){
            const iconSelector = $(this).closest('.form-base').find(`.${iconClass}`);
            if ($(this).val()) {
                iconSelector.addClass("next");
            } else {
                iconSelector.removeClass("next");
            }
        });
    }
    
    // 设置表单阶段转换 - 通用函数
    function setupFormStageTransition(buttonSelector, currentSectionSelector, nextSectionSelector, logMessage) {
        $(buttonSelector).click(function(){
            console.log(logMessage);
            $(currentSectionSelector).addClass("fold-up");
            $(nextSectionSelector).removeClass("folded");
        });
    }
    
    // 处理表单完成后的操作 - 通用函数
    async function handleFormSuccess(formType, lastSectionSelector, successSelector, netIdSelector) {
        console.log(`${formType}：完成输入`);
        $(lastSectionSelector).addClass("fold-up");
        $(successSelector).css("marginTop", 0);
        
        // 获取用户NetID并更新欢迎页面的用户名和头像
        var userNetId = $(netIdSelector).val();
        updateUserName(userNetId);
        
        // 先预先准备好欢迎元素（位置和透明度设为0），但不立即显示
        // 这样在翻转后它们会更快地显示出来
        $('.welcome-element').css({
            'opacity': '0',
            'transform': 'translateY(-20px)', // 缩短初始位移距离
            'transition-duration': '0.4s'     // 加快过渡动画速度
        });
        
        // 显示成功后2秒，执行卡片翻转到欢迎页面
        await delay(2000);
        
        // 在翻转的同时准备好欢迎元素，减少等待时间
        setTimeout(function() {
            $('.welcome-element').css({
                'opacity': '1',
                'transform': 'translateY(0)'
            });
        }, 200); // 在翻转开始后的200ms触发元素显示
        
        $('#window').addClass('flip');
    }
    
    // 使用Promise重构重置动画函数
    function resetAnimation() {
        var win = $('#window');
        
        // 使用Promise链替代回调嵌套
        win.stop().fadeOut(500)
            .promise()
            .then(function() {
                // 重置状态
                win.attr('style', '');
                win.removeClass('flip');
                
                // 重置登录表单
                resetForms();
                
                // 默认显示登录表单
                return switchForm('signup', 'login'); // 使用通用切换函数
            })
            .then(function() {
                // 显示窗口并开始新的动画
                win.fadeIn(500);
            })
            .catch(function(error) {
                console.error("动画重置过程中出错:", error);
            });
    }
    
    // 从NetID中直接使用为用户名
    function updateUserName(netId) {
        if(netId && netId.length > 0) {
            // 直接使用NetID作为用户名
            var username = netId;
            // 如果用户名存在，则在欢迎页面显示
            if(username) {
                $('.user-name').text(config.generalWelcomeText);
                
                // 根据操作类型设置个性化欢迎信息
                if (isLoginOperation) {
                    // 使用配置的模板替换用户名
                    $('.welcome').text(config.welcomeTemplate.login.replace('{username}', username));
                } else {
                    // 使用配置的模板替换用户名
                    $('.welcome').text(config.welcomeTemplate.signup.replace('{username}', username));
                }
            }
        }
    }
    
    // 新增：设置用户头像函数
    function updateUserAvatar(avatarUrl) {
        if(avatarUrl && avatarUrl.length > 0) {
            $('.avatar').attr('src', avatarUrl);
        } else {
            // 如果未提供有效URL，使用默认头像
            $('.avatar').attr('src', config.defaultAvatarUrl);
        }
    }
    
    // 初始化函数
    function init(userConfig = {}) {
        // 合并用户配置和默认配置
        config = $.extend({}, config, userConfig);
        
        // 初始化头像
        updateUserAvatar(config.defaultAvatarUrl);
        
        // 初始化表单状态
        initFormState();
        
        // 设置悬停效果
        setupHoverEffects();
        
        // 绑定事件监听器
        bindEventListeners();
    }
    
    // 公开API
    return {
        init: init,
        updateUserAvatar: updateUserAvatar,
        updateUserName: updateUserName,
        resetForms: resetForms,
        resetAnimation: resetAnimation,
        config: function(newConfig) {
            config = $.extend({}, config, newConfig);
            return this;
        }
    };
})(jQuery);

// 保持向后兼容性：如果配置了自动初始化，则在文档加载完成后自动初始化
jQuery(document).ready(function($) {
    // 自动初始化，除非显式禁用
    if(LoginSignupSystem.config().autoInit !== false) {
        LoginSignupSystem.init();
    }
}); 