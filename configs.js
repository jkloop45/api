module.exports = {

	isAuth: true,

	isInit: 0,
	port: 8089,

	isDBAvailable: false,

	sync: false,
	cookie: {
		signed: false,
		expires: new Date(Date.now + 30 * 60 * 1000),
		path: "/",
		domain: "gospely.com"
			//domain: "localhost"
	},

	dnspod: {
		// baseDomain: 'gospel.design',
		baseDomain: 'gospely.com',
		baseIp: '120.76.235.234',
		config: {
			login_token: "18845,cf418d9ac9fe775becd700e2496c1809",
			// login_token: "28487,80941ffc3bd9a359c93fc184c2534e2d",
			format: "json",
			lang: "cn",
			error_on_empty: 'yes'
		},
		api: {
			infoVersion: 'Info.Version',
			userDetail: 'User.Detail',
			userModify: 'User.Modify',
			userpasswdModify: 'Userpasswd.Modify',
			useremailModify: 'Useremail.Modify',
			telephoneverifyCode: 'Telephoneverify.Code',
			userLog: 'User.Log',
			domainCreate: 'Domain.Create',
			domainList: 'Domain.List',
			domainRemove: 'Domain.Remove',
			domainStatus: 'Domain.Status',
			domainInfo: 'Domain.Info',
			domainLog: 'Domain.Log',
			domainSearchenginepush: 'Domain.Searchenginepush',
			domainUrlincn: 'Domain.Urlincn',
			domainshareCreate: 'Domainshare.Create',
			domainshareList: 'Domainshare.List',
			domainshareModify: 'Domainshare.Modify',
			domainshareRemove: 'Domainshare.Remove',
			domainTransfer: 'Domain.Transfer',
			domainLock: 'Domain.Lock',
			domainLockstatus: 'Domain.Lockstatus',
			domainUnlock: 'Domain.Unlock',
			domainaliasList: 'Domainalias.List',
			domainaliasCreate: 'Domainalias.Create',
			domainaliasRemove: 'Domainalias.Remove',
			domaingroupList: 'Domaingroup.List',
			domaingroupCreate: 'Domaingroup.Create',
			domaingroupModify: 'Domaingroup.Modify',
			domaingroupRemove: 'Domaingroup.Remove',
			domainChangegroup: 'Domain.Changegroup',
			domainIsmark: 'Domain.Ismark',
			domainRemark: 'Domain.Remark',
			domainPurview: 'Domain.Purview',
			domainAcquire: 'Domain.Acquire',
			domainAcquiresend: 'Domain.Acquiresend',
			domainAcquirevalidate: 'Domain.Acquirevalidate',
			recordType: 'Record.Type',
			recordLine: 'Record.Line',
			recordCreate: 'Record.Create',
			recordList: 'Record.List',
			recordModify: 'Record.Modify',
			recordRemove: 'Record.Remove',
			recordDdns: 'Record.Ddns',
			recordRemark: 'Record.Remark',
			recordInfo: 'Record.Info',
			recordStatus: 'Record.Status',
			monitorListsubdomain: 'Monitor.Listsubdomain',
			monitorListsubvalue: 'Monitor.Listsubvalue',
			monitorList: 'Monitor.List',
			monitorCreate: 'Monitor.Create',
			monitorModify: 'Monitor.Modify',
			monitorRemove: 'Monitor.Remove',
			monitorInfo: 'Monitor.Info',
			monitorSetstatus: 'Monitor.Setstatus',
			monitorGethistory: 'Monitor.Gethistory',
			monitorUserdesc: 'Monitor.Userdesc',
			monitorGetdowns: 'Monitor.Getdowns'
		}
	},

	mail: {
		host: "smtp.exmail.qq.com", // 主机
		secureConnection: true, // 使用 SSL
		port: 465, // SMTP 端口
		auth: {
			user: "account@dodora.cn", // 账号
			pass: "doraCN2016" // 密码
		}
	},

	router_config: {
		git: [
			{
				name: '获取变更文件',
				method: 'get',
				url: '/git/change/:id',
				controller: 'gitChange',
				groups: "common_standard_basic_company_100"
			},
			{
				name: 'git commit',
				method: 'get',
				url: '/git/commit/:id',
				controller: 'gitCommit',
				groups: "common_standard_basic_company_100"
			},
			{
				name: 'git push',
				method: 'get',
				url: '/git/push/:id',
				controller: 'gitPush',
				groups: "common_standard_basic_company_100"
			},{
				name: 'git pull',
				method: 'get',
				url: '/git/pull/:id',
				controller: 'gitPull',
				groups: "common_standard_basic_company_100"
			},
			,{
				name: 'git origin',
				method: 'post',
				url: '/git/origin',
				controller: 'gitOrigin',
				groups: "common_standard_basic_company_100"
			}
		],
		applications: [{
			name: '杀终端进程',
			method: 'get',
			url: '/applications/killpid',
			controller: 'killPID',
			groups: "common_standard_basic_company_100"
		},{
			name: '启动应用',
			method: 'get',
			url: '/applications/start/:id',
			controller: 'startApp',
			groups: "common_standard_basic_company_100"
		},
		,{
			name: '中断应用运行',
			method: 'get',
			url: '/applications/stop/:id',
			controller: 'stopApp',
			groups: "common_standard_basic_company_100"
		},{
			name: '重启终端',
			method: 'get',
			url: '/applications/startTerminal',
			controller: 'startTerminal',
			groups: "common_standard_basic_company_100"
		},{
			name: '名称校验',
			method: 'get',
			url: '/applications/validator',
			controller: 'validate',
			groups: "common_standard_basic_company_100"
		}],

		weapp: [{
			name: '云打包',
			method: 'post',
			url: '/weapp/pack',
			controller: 'pack',
			groups: "common_standard_basic_company_100"
		}, {
			name: '下载包',
			method: 'get',
			url: '/weapp/download/:id',
			controller: 'download',
			groups: "common_standard_basic_company_100"
		}],

		vdsite: [{
			name: 'vdsite云打包',
			method: 'post',
			url: '/vdsite/pack',
			controller: 'pack',
			groups: "common_standard_basic_company_100"
		},{
			name: 'vdsite预览',
			method: 'post',
			url: '/vdsite/preview',
			controller: 'pack',
			groups: "common_standard_basic_company_100"
		}, {
			name: 'vdsite下载包',
			method: 'get',
			url: '/vdsite/download',
			controller: 'download',
			groups: "common_standard_basic_company_100"
		},{
			name: 'vdsite发布',
			method: 'get',
			url: '/vdsite/deploy',
			controller: 'deploy',
			groups: "common_standard_basic_company_100"
		},{
			name: 'vdsite 模板',
			method: 'post',
			url: '/vdsite/template',
			controller: 'template',
			groups: "common_standard_basic_company_100"
		},{
			name: 'vdsite 模板',
			method: 'get',
			url: '/vdsite/template',
			controller: 'getTemplate',
			groups: "common_standard_basic_company_100"
		},{
			name: 'vdsite 模板创建静态资源初始化',
			method: 'get',
			url: '/vdsite/static',
			controller: 'staticCopy',
			groups: "common_standard_basic_company_100"
		}],

		users: [{
			name: '登录',
			method: 'post',
			url: '/users/login',
			controller: 'login',
			groups: "common_standard_basic_company_100"
		}, {
			name: '注册',
			method: 'post',
			url: '/users/register',
			controller: 'register',
			groups: "common_standard_basic_company_100"
		}, {
			name: '修改头像',
			method: 'post',
			url: '/users/photo',
			controller: 'updatePhoto',
			groups: "common_standard_basic_company_100"
		}, {
			name: '邮箱激活',
			method: 'get',
			url: '/users/authorization',
			controller: 'authorization',
			groups: "common_standard_basic_company"
		}, {
			name: '微信登录',
			method: 'get',
			url: '/users/wechat',
			controller: 'weixinLogin',
			groups: "common_standard_basic_company"
		}, {
			name: '退出',
			method: 'post',
			url: '/users/logout',
			controller: 'logout',
			groups: "common_standard_basic_company"
		}, {
			name: '获取验证码',
			method: 'get',
			url: '/users/code',
			controller: 'authCode',
			groups: "common_standard_basic_company"
		}, {
			name: '获取手机验证码',
			method: 'get',
			url: '/users/phone/code',
			controller: 'phoneCode',
			groups: "common_standard_basic_company"
		}, {
			name: '验证手机验证码',
			method: 'post',
			url: '/users/verifyphonecode',
			controller: 'verifyPhoneCode',
			groups: "common_standard_basic_company"
		},{
			name: '获取邮箱验证码',
			method: 'get',
			url: '/users/email/code',
			controller: 'getEmailCode',
			groups: "common_standard_basic_company"
		}, {
			name: '验证邮箱验证码',
			method: 'post',
			url: '/users/verifyemailcode',
			controller: 'verifyEmailCode',
			groups: "common_standard_basic_company"
		}, {
			name: '忘记密码',
			method: 'post',
			url: '/users/modify',
			controller: 'modify',
			groups: "common_standard_basic_company"
		},{
			name: '获取文件流',
			method: 'get',
			url: '/users/files/:file',
			controller: 'files',
			groups: "common_standard_basic_company_100"
		}, {
			name: '检查是否被注册',
			method: 'get',
			url: '/users/validator',
			controller: 'validator',
			groups: "common_standard_basic_company_100"
		}, {
			name: '登录验证',
			method: 'get',
			url: '/users/validator',
			controller: 'validator',
			groups: "common_standard_basic_company_100"
		}, {
			name: '用户数据卷大小',
			method: 'get',
			url: '/users/volume/:id',
			controller: 'volume',
			groups: "common_standard_basic_company_100"
		}, {
			name: '订单统计',
			method: 'get',
			url: '/users/chart/orderscount',
			controller: 'chartOrdersCount',
			groups: "common_standard_basic_company_100"
		},{
			name: '用户统计',
			method: 'get',
			url: '/users/chart/userscount',
			controller: 'chartUsersCount',
			groups: "common_standard_basic_company_100"
		},{
			name: '控制面板api',
			method: 'get',
			url: '/users/dashboard',
			controller: 'dashboardApi',
			groups: "common_standard_basic_company_100"
		},{
			name: '第三方登陆信息完善',
			method: 'post',
			url: '/users/complete',
			controller: 'complete',
			groups: "common_standard_basic_company_100"
		}],

		kr: [{
			name: 'search',
			method: 'get',
			url: '/kr/search/:page',
			controller: 'search',
			groups: "common_standard_basic_company"
		}, {
			name: 'article',
			method: 'get',
			url: '/kr/article/:id',
			controller: 'article',
			groups: "common_standard_basic_company"
		}],

		container: [{
			name: '启动容器',
			method: 'get',
			url: '/container/start/:containerName',
			controller: 'start',
			groups: "common_standard_basic_company"
		}, {
			name: '停止容器',
			method: 'get',
			url: '/container/stop/:containerName',
			controller: 'stop',
			groups: "common_standard_basic_company"
		}, {
			name: '重启容器',
			method: 'get',
			url: '/container/restart/:containerName',
			controller: 'restart',
			groups: "common_standard_basic_company"
		}, {
			name: '查看容器信息',
			method: 'get',
			url: '/container/inspect/:containerName',
			controller: 'inspect',
			groups: "common_standard_basic_company"
		}, {
			name: '监控容器运行状态',
			method: 'get',
			url: '/container/stats/:containerName',
			controller: 'stats',
			groups: "common_standard_basic_company"
		}],
		fs: [{
			name: '读文件',
			method: 'post',
			url: '/fs/read',
			controller: 'read',
			groups: "common_standard_basic_company_100"
		}, {
			name: '写文件',
			method: 'post',
			url: '/fs/write',
			controller: 'write',
			groups: "common_standard_basic_company_100"
		}, {
			name: '追加文件',
			method: 'post',
			url: '/fs/append',
			controller: 'append',
			groups: "common_standard_basic_company_100"
		}, {
			name: '删除文件',
			method: 'post',
			url: '/fs/remove',
			controller: 'remove',
			groups: "common_standard_basic_company_100"
		}, {
			name: '复制文件',
			method: 'post',
			url: '/fs/copy',
			controller: 'copy',
			groups: "common_standard_basic_company_100"
		}, {
			name: '移动文件',
			method: 'post',
			url: '/fs/move',
			controller: 'rename',
			groups: "common_standard_basic_company_100"
		}, {
			name: '重命名文件',
			method: 'post',
			url: '/fs/rename',
			controller: 'rename',
			groups: "common_standard_basic_company_100"
		}, {
			name: '创建文件夹',
			method: 'post',
			url: '/fs/mkdir',
			controller: 'mkdir',
			groups: "common_standard_basic_company_100"
		}, {
			name: '删除文件夹',
			method: 'post',
			url: '/fs/rmdir',
			controller: 'rmdir',
			groups: "common_standard_basic_company_100"
		}, {
			name: '复制文件夹',
			method: 'post',
			url: '/fs/copydir',
			controller: 'copy',
			groups: "common_standard_basic_company_100"
		}, {
			name: '移动文件夹',
			method: 'post',
			url: '/fs/dir/move',
			controller: 'rename',
			groups: "common_standard_basic_company_100"
		}, {
			name: '重命名文件夹',
			method: 'post',
			url: '/fs/dir/rename',
			controller: 'rename',
			groups: "common_standard_basic_company_100"
		}, {
			name: '读取文件夹',
			method: 'get',
			url: '/fs/ls/:dirName',
			controller: 'ls',
			groups: "common_standard_basic_company_100"
		}, {
			name: '按需读取文件或文件夹',
			method: 'get',
			url: '/fs/list/file',
			controller: 'list',
			groups: "common_standard_basic_company_100"
		}, {
			name: '按需读取文件或文件夹(无参数)',
			method: 'get',
			url: '/fs/list/optional',
			controller: 'list',
			groups: "common_standard_basic_company_100"
		}, {
			name: '读取所有文件',
			method: 'get',
			url: '/fs/list/all',
			controller: 'all',
			groups: "common_standard_basic_company_100"
		}, {
			name: '上传文件',
			method: 'post',
			url: '/fs/upload',
			controller: 'upload',
			groups: "common_standard_basic_company_100"
		}, {
			name: '上传图片',
			method: 'post',
			url: '/fs/image/upload',
			controller: 'imageUpload',
			groups: "common_standard_basic_company_100"
		},{
			name: '执行shell命令',
			method: 'post',
			url: '/fs/shell/',
			controller: 'shell',
			groups: "common_standard_basic_company_100"
		}, {
			name: '打包源代码',
			method: 'get',
			url: '/fs/packsrc',
			controller: 'packsrc',
			groups: "common_standard_basic_company_100"
		}]
	},
	file: {
		basePath: '/var/www/storage/profiles/'
	},
}
