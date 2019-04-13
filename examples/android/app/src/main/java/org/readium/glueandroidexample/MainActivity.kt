package org.readium.glueandroidexample

import android.annotation.SuppressLint
import android.content.Context
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.widget.ArrayAdapter
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        ArrayAdapter.createFromResource(
            this,
            R.array.testPicker_array,
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinner.adapter = adapter
        }

        initWebView()
    }

    @SuppressLint("SetJavaScriptEnabled")
    fun initWebView() {
        webView.loadUrl("file:///android_asset/index.html")
        webView.settings.javaScriptEnabled = true
        webView.addJavascriptInterface(ExampleAppInterface(this), "Android")
    }

    class ExampleAppInterface(private val mContext: Context) {

        /** Show a toast from the web page  */
        @JavascriptInterface
        fun showToast(toast: String) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show()
        }
    }

}

