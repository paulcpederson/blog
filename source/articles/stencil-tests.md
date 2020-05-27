---
title: Stencil Testing Cheatsheet
date: 2020-05-18
template: _templates/snippets.html
description: A collection of useful code snippets and examples for writing End to End tests in a Stencil project.
snippet: true
---

### Basic test

```ts
import { newE2EPage } from "@stencil/core/testing";

describe("example", () => {
  it("should render a my-comp", async () => {
    const page = await newE2EPage();
    await page.setContent(`<my-comp></my-comp>`);
    const el = await page.find("my-comp");
    expect(el).not.toBeNull();
  });
});
```

---

### Type inside an input

```ts
const input = await page.find("my-comp >>> input");
await input.press("8");
await input.press("KeyM");
await input.press(" ");
await page.keyboard.down("Shift");
await input.press("KeyM");
await page.keyboard.up("Shift");
```

---

### Find an element in the shadow DOM

```ts
const el = await page.find("my-comp >>> .close-button");
```

---

### Call a method on a component

```ts
const elm = await page.find("my-comp");
const value = await elm.callMethod("methodName");
```

---

### Set a prop on a component

```ts
await page.setContent(`<my-comp></my-comp>`);
await page.$eval("my-comp", elm => {
  elm.first = "Marty";
});
await page.waitForChanges();
```

---

### Move the mouse

```ts
await page.mouse.move(200, 300);
await page.mouse.down();
await page.mouse.move(240, 380);
await page.mouse.up();
```

---

### Check an element is visible

```ts
const wrapper = await page.find("my-comp >>> .visible");
const visible = await wrapper.isVisible();
expect(visible).toBe(true);
```

---

### Check that an element has an attribute

```ts
const component = await page.find("my-comp");
expect(component).toHaveAttribute("attribute");
expect(component).toEqualAttribute("attribute", "value");
```

---

### Check that an event was fired

```ts
const changedEvent = await page.spyOnEvent("myEventName");
// perform actions that should fire the event
await page.waitForChanges();
expect(changedEvent).toHaveReceivedEventTimes(1);
```

---


### Check the detail of a custom event

```ts
const changedEvent = await page.spyOnEvent("myEventName");
// perform actions that should fire the event
await page.waitForChanges();
expect(changedEvent).toHaveFirstReceivedEventDetail(true);
```

---

### Check that a property has changed

```ts
const component = await page.find("my-comp");
let value = await slider.getProperty("value");
expect(value).toBe(30);
// perform actions that should change the value
expect(await component.getProperty("value")).toBe(31);
```

---

### Check the length of a DOM collection

```ts
const children = await page.findAll("my-comp >>> .child");
expect(children.length).toBe(11);
```

---

### Check text content of an element

```ts
const button = await page.find("my-comp >>> button");
const text = button.textContent;
expect(text).toBe("hello world");
```
