package com.mymars

import com.facebook.react.PackageList
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.reactnativenavigation.NavigationApplication
import com.reactnativenavigation.react.NavigationReactNativeHost

class MainApplication : NavigationApplication() {

  /**
   * Required even though this app is bridgeless. Parts of react-native-navigation still read the
   * legacy host -- Context.isDebug() does
   * `(applicationContext as ReactApplication).reactNativeHost.useDeveloperSupport`. Without this
   * override the default ReactApplication implementation throws
   * "You should not use ReactNativeHost directly in the New Architecture".
   */
  override val reactNativeHost: ReactNativeHost =
    object : NavigationReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> = PackageList(this@MainApplication).packages

      override fun getJSMainModuleName(): String = "index"

      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

      override val isNewArchEnabled: Boolean = true

      override val isHermesEnabled: Boolean = true
    }

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  // NOTE: do NOT call ReactNativeApplicationEntryPoint.loadReactNative(this) here, which is what
  // the stock React Native template does (and what `npx rnn-link` leaves behind).
  // NavigationApplication.onCreate() already performs SoLoader.init() and
  // DefaultNewArchitectureEntryPoint.load(); calling it again crashes at startup with
  // "Feature flags cannot be overridden more than once".
  override fun onCreate() {
    super.onCreate()
  }
}
