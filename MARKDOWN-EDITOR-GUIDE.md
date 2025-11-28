# Markdown Editor Guide

Complete guide to using the WYSIWYG Markdown editor in the admin panel.

## ✨ Features

- 📝 **WYSIWYG Editing** - See your formatting in real-time
- 🎨 **Toolbar** - Easy access to common formatting options
- 👁️ **Live Preview** - See how your content will look
- 📱 **Responsive** - Works on desktop and mobile
- ⌨️ **Keyboard Shortcuts** - Fast formatting with hotkeys
- 🔄 **Auto-Save** - Content is saved as you type

## 📍 Where It's Used

### Recipe Instructions

Location: **Admin > Recipes > Edit Recipe > Instructions**

- Write step-by-step cooking instructions
- Format with numbered lists, bold, italic, etc.
- Preview how it will appear on the recipe page

### Guide Content

Location: **Admin > Guides > Edit Guide > Content**

- Write comprehensive foraging guides
- Use headings to organize sections
- Add lists, links, images, code blocks
- Preview the full formatted guide

## 🎯 How to Use

### Basic Formatting

**Bold Text**:
- Click the **B** button in toolbar
- Or type: `**your text**`
- Keyboard: `Ctrl+B` (Windows) or `Cmd+B` (Mac)

**Italic Text**:
- Click the *I* button
- Or type: `*your text*`
- Keyboard: `Ctrl+I` or `Cmd+I`

**Headings**:
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

**Lists**:

Bullet list:
```markdown
- First item
- Second item
- Third item
```

Numbered list:
```markdown
1. First step
2. Second step
3. Third step
```

**Links**:
```markdown
[Link text](https://example.com)
```

**Images**:
```markdown
![Alt text](https://example.com/image.jpg)
```

### Advanced Formatting

**Code Inline**:
```markdown
Use `code` for inline code
```

**Code Blocks**:
````markdown
```
function example() {
  return "Hello";
}
```
````

**Blockquotes**:
```markdown
> This is a quote
> It can span multiple lines
```

**Tables**:
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
| Data 3   | Data 4   |
```

**Horizontal Rule**:
```markdown
---
```

## 📋 Toolbar Buttons

The editor includes these toolbar buttons:

- **B** - Bold
- **I** - Italic
- **H** - Headings (dropdown)
- **🔗** - Insert link
- **🖼️** - Insert image
- **📝** - Code block
- **⚡** - Inline code
- **📋** - Quote
- **📊** - Table
- **—** - Horizontal rule
- **•** - Bullet list
- **1.** - Numbered list
- **✓** - Checklist

## 💡 Tips for Recipe Instructions

### Good Structure

```markdown
## Preparation

1. **Preheat** oven to 350°F (175°C)
2. **Gather** all ingredients
3. **Chop** vegetables into 1-inch pieces

## Cooking

1. Heat oil in a large pan over *medium heat*
2. Add vegetables and cook for **5-7 minutes**
3. Season with:
   - Salt to taste
   - Black pepper
   - Fresh herbs

## Finishing

> **Pro tip:** Let it rest for 5 minutes before serving

Serve hot with your favorite side dish.
```

### Best Practices

1. **Use numbered lists** for sequential steps
2. **Bold key actions** (preheat, mix, bake)
3. **Italicize notes** or optional steps
4. **Use code format** for exact measurements: `2 cups` or `350°F`
5. **Add quotes** for tips and warnings

## 💡 Tips for Guide Content

### Good Structure

```markdown
# Getting Started with Foraging

## Introduction

Foraging is the practice of gathering wild food from nature...

## Safety First

⚠️ **Warning:** Never eat anything you cannot positively identify!

### Key Safety Rules

1. Start with easily identifiable plants
2. Learn from experienced foragers
3. Use multiple identification methods

## Best Seasons

### Spring
- Wild greens
- Shoots and sprouts
- Early flowers

### Summer
- Berries
- Fruits
- Edible flowers

## Essential Tools

You'll need:
- Field guide
- Basket or bag
- Knife or scissors
- Camera for documentation

## Resources

For more information, visit [Happy Foraging](https://happyforaging.com)
```

### Best Practices

1. **Start with # for main title**
2. **Use ## for major sections**
3. **Use ### for subsections**
4. **Add warnings** with blockquotes and emojis
5. **Include images** for visual identification
6. **Link to resources** for additional learning

## ⌨️ Keyboard Shortcuts

### Common Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Bold | `Ctrl+B` | `Cmd+B` |
| Italic | `Ctrl+I` | `Cmd+I` |
| Link | `Ctrl+K` | `Cmd+K` |
| Code | `Ctrl+E` | `Cmd+E` |
| Undo | `Ctrl+Z` | `Cmd+Z` |
| Redo | `Ctrl+Y` | `Cmd+Shift+Z` |

### Editor Shortcuts

| Action | Shortcut |
|--------|----------|
| Insert heading | `Ctrl+Alt+1` through `6` |
| Insert list | `Ctrl+Shift+L` |
| Insert quote | `Ctrl+Shift+Q` |
| Insert code block | `Ctrl+Shift+C` |

## 🎨 Live Preview

The editor shows a **live preview** as you type:

- **Left side**: Raw markdown text
- **Right side**: Formatted preview (can be toggled)
- **Drag the divider** to resize panels

### Preview Modes

Click the buttons at the top:

- **Edit** - Show markdown source only
- **Preview** - Show formatted preview only
- **Split** - Show both side by side (default)

## 📱 Mobile Usage

On mobile devices:

- Editor switches to single-column view
- Tap the preview button to toggle views
- Use toolbar buttons instead of keyboard shortcuts
- Tap and hold for more options

## 🔧 Advanced Features

### Resize Editor

- **Drag the bottom edge** to resize the editor height
- Useful for long content like guides
- Height setting is saved per form

### Paste Content

- **Paste from Word** - Automatically converts formatting
- **Paste from web** - Cleans HTML to markdown
- **Paste images** - Currently shows markdown syntax (upload separately)

### Syntax Highlighting

Code blocks automatically highlight based on language:

````markdown
```javascript
function hello() {
  return "Hello, world!";
}
```
````

## 💾 Saving Content

Content is **not auto-saved** - you must click the save button!

1. Write your content in the editor
2. Click **"Create Recipe"** or **"Update Recipe"**
3. Your markdown is saved to the database
4. It renders on the public page with formatting

## 🖼️ Adding Images

### Option 1: Upload First

1. Upload image using the Image Upload section
2. Copy the public URL
3. Insert in markdown: `![Description](URL)`

### Option 2: External Images

```markdown
![Wild mushrooms](https://example.com/mushrooms.jpg)
```

### Option 3: Relative Paths

```markdown
![Recipe photo](/images/recipes/my-recipe.jpg)
```

## 🐛 Troubleshooting

### Editor Not Loading

**Symptom**: Shows "Loading editor..." forever

**Fix**:
- Check browser console for errors (F12)
- Refresh the page
- Clear browser cache
- Try a different browser

### Formatting Not Showing

**Symptom**: Markdown appears as plain text on public page

**Fix**:
- Make sure you're using the MarkdownEditor component
- Check that recipe/guide page has MarkdownPreview component
- Verify markdown syntax is correct

### Lost Content

**Symptom**: Content disappeared after navigating away

**Fix**:
- Always click **Save** before leaving the page
- Browser may warn you about unsaved changes
- No auto-save - must manually save

### Preview Not Updating

**Symptom**: Preview shows old content

**Fix**:
- Wait a moment - preview updates as you type
- Click the Preview mode button to refresh
- If stuck, refresh the entire page

## 📊 Markdown Cheat Sheet

Quick reference for common syntax:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
***Bold and italic***

[Link text](https://url.com)
![Image alt](https://image-url.jpg)

- Bullet list item
  - Nested item

1. Numbered list item
2. Second item

> Blockquote
> Continues here

`inline code`

```
Code block
multiple lines
```

| Table | Header |
|-------|--------|
| Cell  | Cell   |

---

Horizontal rule (above)

- [ ] Checklist item
- [x] Completed item
```

## 🎓 Best Practices Summary

### Recipe Instructions

✅ **Do:**
- Use numbered lists for steps
- Bold key actions
- Be concise and clear
- Include cooking times and temperatures
- Add tips in blockquotes

❌ **Don't:**
- Write long paragraphs
- Use complex formatting unnecessarily
- Forget to include measurements
- Skip important safety warnings

### Guide Content

✅ **Do:**
- Use clear heading hierarchy
- Include images for identification
- Add safety warnings prominently
- Link to additional resources
- Organize by sections

❌ **Don't:**
- Create confusing heading levels
- Write walls of text
- Forget safety information
- Assume prior knowledge
- Skip visual examples

## 🚀 Next Steps

1. **Practice** - Try the editor in a test recipe or guide
2. **Experiment** - Test different formatting options
3. **Preview** - Always check how it looks before saving
4. **Save Often** - Don't lose your work!
5. **View Live** - Check the public page to see final result

---

**Need help?** The editor shows a hint below: "Supports Markdown formatting" with examples.

**Want more?** Check the [Markdown Guide](https://www.markdownguide.org/) for advanced features.
