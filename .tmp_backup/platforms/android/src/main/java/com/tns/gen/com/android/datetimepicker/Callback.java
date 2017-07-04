package com.tns.gen.com.android.datetimepicker;

public class Callback implements com.android.datetimepicker.Callback {
	public Callback() {
		com.tns.Runtime.initInstance(this);
	}

	public void onResult(java.lang.Object param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onResult", void.class, args);
	}

}
