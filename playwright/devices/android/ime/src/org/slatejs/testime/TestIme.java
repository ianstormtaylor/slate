package org.slatejs.testime;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.inputmethodservice.InputMethodService;
import android.util.Base64;
import android.view.View;
import android.view.inputmethod.ExtractedText;
import android.view.inputmethod.ExtractedTextRequest;
import android.view.inputmethod.InputConnection;
import android.widget.TextView;
import java.nio.charset.StandardCharsets;

public class TestIme extends InputMethodService {
  static final String ACTION = "org.slatejs.testime.COMMAND";

  private final BroadcastReceiver receiver =
      new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
          setResultData(run(intent));
        }
      };

  @Override
  public void onCreate() {
    super.onCreate();
    registerReceiver(receiver, new IntentFilter(ACTION), Context.RECEIVER_EXPORTED);
  }

  @Override
  public void onDestroy() {
    unregisterReceiver(receiver);
    super.onDestroy();
  }

  @Override
  public View onCreateInputView() {
    TextView view = new TextView(this);
    view.setText("Slate test keyboard");
    view.setMinHeight(240);
    return view;
  }

  @Override
  public boolean onEvaluateFullscreenMode() {
    return false;
  }

  private String decodedText(Intent intent) {
    String encoded = intent.getStringExtra("b64");
    if (encoded == null) return "";
    return new String(Base64.decode(encoded, Base64.DEFAULT), StandardCharsets.UTF_8);
  }

  private String run(Intent intent) {
    InputConnection connection = getCurrentInputConnection();
    if (connection == null) return "error:no-input-connection";
    String op = intent.getStringExtra("op");
    String text = decodedText(intent);
    int a = intent.getIntExtra("a", 1);
    int b = intent.getIntExtra("b", 0);
    boolean ok;
    switch (op == null ? "" : op) {
      case "compose":
        ok = connection.setComposingText(text, 1);
        break;
      case "commit":
        ok = connection.commitText(text, 1);
        break;
      case "finish":
        ok = connection.finishComposingText();
        break;
      case "delete":
        ok = connection.deleteSurroundingText(a, b);
        break;
      case "region":
        ok = connection.setComposingRegion(a, b);
        break;
      case "select":
        ok = connection.setSelection(a, b);
        break;
      case "key":
        sendDownUpKeyEvents(a);
        ok = true;
        break;
      case "begin":
        ok = connection.beginBatchEdit();
        break;
      case "end":
        ok = connection.endBatchEdit();
        break;
      case "state":
        ExtractedText extracted = connection.getExtractedText(new ExtractedTextRequest(), 0);
        if (extracted == null) return "state:none";
        return "state:" + extracted.selectionStart + ":" + extracted.selectionEnd + ":" + extracted.text;
      default:
        return "error:unknown-op:" + op;
    }
    return ok ? "ok" : "error:rejected";
  }
}
