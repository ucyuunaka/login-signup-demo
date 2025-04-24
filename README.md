### (⭐软件工程大作业自留)

# <center>登录与注册系统模块</center>

> 这是一个模块化的登录与注册系统，包含了完整的表单交互、动画效果和用户欢迎页面。该系统已经封装为可重用模块，可以轻松集成到其他项目中。

## 功能特点

- 登录和注册表单切换
- 分步填写表单的动画效果
- 成功登录/注册后的欢迎页面
- 可配置的用户头像显示
- 可自定义的欢迎语模板

## 如何使用

### 基础使用

只需引入相关文件，系统会自动初始化：

```html
<link rel="stylesheet" href="combined-login-signup.css" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="combined-login-signup.js"></script>
```

### 自定义配置

可以通过以下方式自定义系统配置：

```javascript
// 禁用自动初始化
LoginSignupSystem.config({
  autoInit: false,
});

// 使用自定义配置初始化
LoginSignupSystem.init({
  defaultAvatarUrl: "您的自定义头像URL",
  welcomeTemplate: {
    login: "您回来了，{username}！",
    signup: "欢迎新用户，{username}！",
  },
  generalWelcomeText: "您好",
});
```

### 动态更新头像

在系统初始化后，您可以随时更新用户头像：

```javascript
LoginSignupSystem.updateUserAvatar("新的头像URL");
```

## 配置选项

系统支持以下配置选项：

| 选项                   | 说明                   | 默认值                  |
| ---------------------- | ---------------------- | ----------------------- |
| defaultAvatarUrl       | 默认头像 URL           | CDN 上的示例头像        |
| welcomeTemplate.login  | 登录成功后的欢迎语模板 | "欢迎回来，{username}!" |
| welcomeTemplate.signup | 注册成功后的欢迎语模板 | "欢迎加入，{username}!" |
| generalWelcomeText     | 通用欢迎文本           | "嗨，别来无恙"          |
| autoInit               | 是否自动初始化         | true                    |

## API 参考

系统提供了以下 API 方法：

- `LoginSignupSystem.init(config)` - 初始化系统
- `LoginSignupSystem.config(newConfig)` - 修改配置
- `LoginSignupSystem.updateUserAvatar(url)` - 更新用户头像
- `LoginSignupSystem.updateUserName(name)` - 更新用户名
- `LoginSignupSystem.resetForms(resetAnimation)` - 重置表单
- `LoginSignupSystem.resetAnimation()` - 重置动画

## 集成到其他项目

要将此系统集成到其他项目中，您需要：

1. 复制 `combined-login-signup.js`、`combined-login-signup.css` 和 HTML 结构
2. 确保引入了 jQuery 和 Font Awesome 依赖
3. 根据需要自定义系统配置

## 浏览器兼容性

系统在主流现代浏览器中测试通过，特别为 Firefox 提供了额外的兼容性提示。
