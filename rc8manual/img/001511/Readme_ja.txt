================================================================================
	anyFeed Provider
	FlexFactory anyfeed	

	Version 1.0.0

	DENSO WAVE INC.
================================================================================

-----
1. インストール

インストール: regsvr32 CaoProvAnyFeed.DLL
アンインストール: regsvr32 -u CaoProvAnyFeed.DLL

-----
2. サポート関数一覧

　2-1. CaoController クラス
　  (1) AddController(<ControllerName>,<ProviderName>,<Machine>,<Option>) ' 接続処理

	<ProviderName>::= "CaoProv.FlexFactory.anyFeed"
	<Option>::= "Conn=<接続パラメータ>[, Timeout=<タイムアウト時間(ms)>]"

	・<接続パラメータ>は以下のとおりです・

		com:<COM Port>[:<BaudRate>[:<Parity>:<DataBits>:<StopBits>]]”

			<COM Port>	: COMポート番号．‘1’-COM1,‘2’-COM2, … 
			<BaudRate>	: 通信速度．4800，9600，19200，38400，57600，115200．
			<Parity>	: パリティ．‘N’-NONE，‘E’-EVEN，‘O’-ODD．
			<DataBits>	: データビット数．‘7’-7bit，‘8’-8bit．
			<StopBits>	: ストップビット数．‘1’-1bit，‘2’-2bit．

 　	・タイムアウト時間のデフォルトは500ms
			　              
    (2) Execute(<CommandName>, <Parameter>)
	サポートしているコマンドは以下のとおりです。    	

    [Command name]		[Parameter]		[	AnyFeedCmd]
	Ffwd			None			"x=1"
	Fbwd			None			"x=2"
	FlipFwd			None			"x=3"
	FlipBwd			None			"x=4"
	Flip			None			"x=5"
	Dispense		None			"x=6"
	Purge			None			"x=7"
	Init			None			"x=16"
	Stop			None			"x=15"
	Startfirmware		None			"S RUN"
	Restartfirmware		None			"x=31"
	ResetError		None			"x=30"
	SetFfwdTurns		turns (VT_I4)		"ab[1]=<turns>"
	SetFfwdSpeed		speed (VT_I4)		"ab[17]=<speed> x=17"
	SetFbwdTurns		turns (VT_I4)		"ab[2]=<turns>"
	SetFbwdSpeed		speed (VT_I4)		"ab[18]=<speed> x=18"
	SetFlipFwdTurns		turns (VT_I4)		"ab[3]=<turns>"
	SetFlipFwdSpeed		speed (VT_I4)		"ab[19]=<speed> x=19"
	SetFlipBwdTurns		turns (VT_I4)		"ab[4]=<turns>"
	SetFlipBwdSpeed		speed (VT_I4)		"ab[20]=<speed> x=20"
	SetFlipTurns		turns (VT_I4)		"ab[5]=<turns>"
	SetFlipSpeed		speed (VT_I4)		"ab[21]=<speed> x=21"
	SetDispenseTurns	turns (VT_I4)		"ab[6]=<turns>"
	SetDispenseSpeed	speed (VT_I4)		"ab[22]=<speed> x=22"
	SetPurgeTurns		turns (VT_I4)		"ab[7]=<turns>"
	SetPurgeSpeed		speed (VT_I4)		"ab[23]=<speed> x=23"
	SetTriggerOutput	mode (VT_I4)		"ab[12]=<mode>"
	SetTriggerInterval	interval (VT_I4)	"ab[25]=<interval> x=25"
	SetTriggerDelay		delay (VT_I4)		"ab[26]=<delay> x=26"
	SetPreFeederType	type (VT_I4)		"ab[13]=<type>"
	SetDigitalOutputs	number (VT_I4)		"ab[27]=<number> x=27"

	<turns>	:	0...127
	<speed>	:	1...10
	<mode>	:	0.output is OFF, 1.output is ON, 2.output is strobed as described
	<type>	:	1.standard bulk-container, 2.external prefeeder
	<interval>:	1...65  20ms/point default 240ms
	<delay>	:	1...65  20ms/point default 500ms
	<number>:	0.Engages the dispense clutch, 1.Engages the flip clutch, 2.Turns the backlight off, 3.Turns the backlight on, 4.Moves the retainer gate up, 5.Moves the retainer gate down

-----
3. エラーコード

    [Anyfeeder Hardware	 	[AnyFeeder Provider	[Message]
     Error Number]		 Error number]
	--			0x80000900		timeout
	--			No error number 	Value does not fall within the expected range
				
	m1			0x80100001		No Echo received from Motor chain
	m2			0x80100002		Invalid command number or syntax
	m3			0x80100003		Motor 1 not responding
	m4			0x80100004		Motor 2 not responding
	m5			0x80100005		Motor 1 and 2 not responding
	m12			0x8010000C		Motor 1 received a command which is not supported
	m13			0x8010000D		Motor 1 reports a servo error
	m16			0x80100010		Motor 1 not initialized
	m17			0x80100011		Error state on Motor 1
	m22			0x80100016		Motor 2 received a command which is not supported 
	m23			0x80100017		Motor 2 reports a servo error
	m26			0x8010001A		Motor 2 not initialized
	m27			0x8010001B		Error state on Motor 2
	m28			0x8010001C		Timeout- no sync-signal

-----
以上．
