async_test((t) => {
  fetch("resources/echo-critical-hint.py")
      .then((r) => r.text())
      .then((r) => {
        t.step(()=>{assert_equals(r, "FAIL")});
        t.done();
      });
}, "Critical-CH")
