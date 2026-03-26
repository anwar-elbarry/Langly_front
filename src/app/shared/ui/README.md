# Langly UI Component Library

A minimalist, Notion/Linear-inspired design system built with Angular standalone components and CSS custom properties.

**Color palette:** Ink Black · Prussian Blue · Dusk Blue · Lavender Grey · Alabaster Grey

**Test page:** Run `ng serve` and navigate to `/test` to see all components live.

---

## Design Tokens

All components reference CSS custom properties defined in `src/styles.css`. To change the theme, edit these variables:

```css
:root {
    --color-bg, --color-bg-subtle, --color-bg-muted
    --color-border
    --color-text, --color-text-secondary, --color-text-muted
    --color-accent, --color-accent-hover, --color-accent-light
    --color-danger, --color-success, --color-warning, --color-info
    --radius-sm, --radius-md, --radius-lg
    --shadow-sm, --shadow-md, --shadow-lg
}
```

---

## Button

**Selector:** `<app-button>`  
**Import:** `ButtonComponent` from `shared/ui/button/button`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'success' \| 'link'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `fullWidth` | `boolean` | `false` | Takes full container width |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |

```html
<app-button variant="primary">Save</app-button>
<app-button variant="danger" size="sm">Delete</app-button>
<app-button [loading]="true">Saving...</app-button>
<app-button variant="outline" [fullWidth]="true">Full Width</app-button>
```

---

## Form Field

**Selector:** `<app-form-field>`  
**Import:** `FormFieldComponent` from `shared/ui/form-field/form-field`

Wraps any form control with a label, error message, or hint.

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | `''` | Label text |
| `error` | `string` | `''` | Error message (shows in red) |
| `hint` | `string` | `''` | Helper text below the control |
| `required` | `boolean` | `false` | Shows red asterisk on label |

```html
<app-form-field label="Email" [required]="true" error="Invalid email">
    <app-input type="email" placeholder="you@example.com" [error]="true" />
</app-form-field>
```

---

## Input

**Selector:** `<app-input>`  
**Import:** `InputComponent` from `shared/ui/input/input`

Supports `ControlValueAccessor` — works with Reactive Forms and `ngModel`.

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | `string` | `'text'` | HTML input type |
| `placeholder` | `string` | `''` | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `boolean` | `false` | Red border for error state |

```html
<app-input placeholder="Enter name" />
<app-input type="password" [error]="true" />
<app-input formControlName="email" />
```

---

## Textarea

**Selector:** `<app-textarea>`  
**Import:** `TextareaComponent` from `shared/ui/textarea/textarea`

Supports `ControlValueAccessor`.

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `placeholder` | `string` | `''` | Placeholder text |
| `rows` | `number` | `4` | Number of visible rows |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `boolean` | `false` | Red border for error state |

```html
<app-textarea placeholder="Write something..." [rows]="5" />
```

---

## Select

**Selector:** `<app-select>`  
**Import:** `SelectComponent` from `shared/ui/select/select`

Wraps a native `<select>` with a custom chevron icon. Use `<ng-content>` for options.

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `boolean` | `false` | Red border for error state |

```html
<app-select>
    <option value="" disabled selected>Choose...</option>
    <option value="a">Option A</option>
    <option value="b">Option B</option>
</app-select>
```

---

## Search Select

**Selector:** `<app-search-select>`  
**Import:** `SearchSelectComponent` from `shared/ui/search-select/search-select`

A searchable select dropdown that allows users to filter options. Supports `ControlValueAccessor`.

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `options` | `Option[]` | `[]` | Array of options (`{id: any, label: string}`) |
| `placeholder` | `string` | `'Search and select...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `boolean` | `false` | Red border for error state |

```html
<app-search-select [options]="searchOptions" placeholder="Type to search..." />
```

---

## Checkbox

**Selector:** `<app-checkbox>`  
**Import:** `CheckboxComponent` from `shared/ui/checkbox/checkbox`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | `''` | Label text |
| `checked` | `boolean` | `false` | Checked state |
| `disabled` | `boolean` | `false` | Disabled state |

| Output | Type | Description |
|--------|------|-------------|
| `checkedChange` | `boolean` | Emitted when toggled |

```html
<app-checkbox label="Remember me" [(checked)]="rememberMe" />
```

---

## Radio

**Selector:** `<app-radio>`  
**Import:** `RadioComponent` from `shared/ui/radio/radio`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | `''` | Label text |
| `name` | `string` | `''` | Radio group name |
| `value` | `string` | `''` | Radio value |
| `checked` | `boolean` | `false` | Checked state |
| `disabled` | `boolean` | `false` | Disabled state |

| Output | Type | Description |
|--------|------|-------------|
| `selected` | `string` | Emits the value when selected |

```html
<app-radio label="Option A" name="group" value="a"
    [checked]="selected === 'a'" (selected)="selected = $event" />
<app-radio label="Option B" name="group" value="b"
    [checked]="selected === 'b'" (selected)="selected = $event" />
```

---

## Card

**Selector:** `<app-card>`  
**Import:** `CardComponent` from `shared/ui/card/card`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `hoverable` | `boolean` | `false` | Lift + shadow on hover |
| `imageSrc` | `string` | `''` | Header image URL |
| `imageAlt` | `string` | `''` | Image alt text |

**Content slots:** default body, `[card-footer]`

```html
<app-card [hoverable]="true">
    <h3>Card Title</h3>
    <p>Card body content.</p>
    <div card-footer>
        <app-button variant="primary" size="sm">Action</app-button>
    </div>
</app-card>
```

---

## Alert

**Selector:** `<app-alert>`  
**Import:** `AlertComponent` from `shared/ui/alert/alert`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Color + icon variant |
| `dismissible` | `boolean` | `false` | Shows close button |

| Output | Type | Description |
|--------|------|-------------|
| `dismissed` | `void` | Emitted when dismissed |

```html
<app-alert type="success" [dismissible]="true">
    <strong>Success!</strong> Changes saved.
</app-alert>
```

---

## Toast

**Selector:** `<app-toast-container>`  
**Import:** `ToastContainerComponent` from `shared/ui/toast/toast`  
**Service:** `ToastService` from `shared/ui/toast/toast.service`

### Setup

Add the container **once** in your root template (e.g. `app.html`):

```html
<router-outlet />
<app-toast-container />
```

### Usage

```typescript
import { ToastService } from './shared/ui/toast/toast.service';

export class MyComponent {
    private toast = inject(ToastService);

    save() {
        this.toast.success('Saved successfully!');
    }

    handleError() {
        this.toast.error('Something went wrong.');
    }
}
```

**Service methods:**

| Method | Description |
|--------|-------------|
| `info(message, duration?)` | Blue info toast |
| `success(message, duration?)` | Green success toast |
| `warning(message, duration?)` | Yellow warning toast |
| `error(message, duration?)` | Red error toast |
| `show(message, type, duration?)` | Generic (default: 4000ms) |
| `remove(id)` | Manually dismiss a toast |

---

## Modal

**Selector:** `<app-modal>`  
**Import:** `ModalComponent` from `shared/ui/modal/modal`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls visibility |
| `closeOnBackdrop` | `boolean` | `true` | Click backdrop to close |

| Output | Type | Description |
|--------|------|-------------|
| `closed` | `void` | Emitted on close (backdrop, X button, or Escape key) |

**Content slots:** `[modal-header]`, default body, `[modal-footer]`

```html
<app-button (click)="showModal = true">Open</app-button>

<app-modal [isOpen]="showModal" (closed)="showModal = false">
    <span modal-header>Confirm</span>
    <p>Are you sure?</p>
    <div modal-footer>
        <app-button variant="outline" (click)="showModal = false">Cancel</app-button>
        <app-button variant="primary" (click)="confirm()">Yes</app-button>
    </div>
</app-modal>
```

---

## Spinner

**Selector:** `<app-spinner>`  
**Import:** `SpinnerComponent` from `shared/ui/spinner/spinner`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size (16/24/40px) |
| `color` | `'accent' \| 'white' \| 'muted'` | `'accent'` | Spinner color |

```html
<app-spinner />
<app-spinner size="lg" color="muted" />
```

---

## Table

**Selector:** `<app-table>`  
**Import:** `TableComponent` from `shared/ui/table/table`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `hoverable` | `boolean` | `true` | Row highlight on hover |
| `striped` | `boolean` | `false` | Alternating row backgrounds |
| `compact` | `boolean` | `false` | Reduced padding |

Use standard `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` inside.

**Built-in badge classes:** `badge-success`, `badge-danger`, `badge-warning`, `badge-info`

```html
<app-table [hoverable]="true" [striped]="true">
    <thead>
        <tr>
            <th>Name</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John Doe</td>
            <td><span class="badge badge-success">Active</span></td>
        </tr>
    </tbody>
</app-table>
```
