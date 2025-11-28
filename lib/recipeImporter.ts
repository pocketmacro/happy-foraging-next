export interface ParsedRecipe {
  title: string
  ingredients: Array<{
    name: string
    quantity: string
    notes: string
  }>
  instructions: string
}

export function parseRecipeText(text: string): ParsedRecipe {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

  let ingredientsStartIndex = -1
  let instructionsStartIndex = -1

  // Find where ingredients and instructions sections start
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase()
    if (lowerLine === 'ingredients' || lowerLine === 'ingredient') {
      ingredientsStartIndex = i + 1
    } else if (lowerLine === 'instructions' || lowerLine === 'instruction' || lowerLine === 'directions' || lowerLine === 'method') {
      instructionsStartIndex = i + 1
      break
    }
  }

  // If no "Ingredients" header found, assume ingredients start at line 0
  if (ingredientsStartIndex === -1) {
    ingredientsStartIndex = 0
  }

  // If no instructions section found, look for the first paragraph-like text
  if (instructionsStartIndex === -1) {
    // Find first line that looks like a paragraph (longer text, not a simple ingredient)
    for (let i = ingredientsStartIndex; i < lines.length; i++) {
      if (lines[i].length > 50 || lines[i].match(/\.\s/)) {
        instructionsStartIndex = i
        break
      }
    }
  }

  // If still not found, assume everything is ingredients
  if (instructionsStartIndex === -1) {
    instructionsStartIndex = lines.length
  }

  // Parse ingredients
  const ingredients: Array<{ name: string; quantity: string; notes: string }> = []
  for (let i = ingredientsStartIndex; i < instructionsStartIndex && i < lines.length; i++) {
    const line = lines[i]
    if (line.length === 0) continue

    const parsed = parseIngredientLine(line)
    if (parsed) {
      ingredients.push(parsed)
    }
  }

  // Parse instructions
  const instructionLines = lines.slice(instructionsStartIndex)
  const instructions = instructionLines.join('\n\n')

  return {
    title: 'Imported Recipe',
    ingredients,
    instructions,
  }
}

function parseIngredientLine(line: string): { name: string; quantity: string; notes: string } | null {
  // Remove leading bullets or dashes
  line = line.replace(/^[-•*]\s*/, '')

  // Common quantity patterns
  const quantityPattern = /^(\d+\/?\d*\s*(?:cups?|tablespoons?|tbsp|teaspoons?|tsp|lbs?|pounds?|oz|ounces?|grams?|g|kg|ml|liters?|l|pinch|cloves?|bunches?|bunches?|slices?)?)\s+(.+)$/i
  const match = line.match(quantityPattern)

  if (match) {
    const quantity = match[1].trim()
    const rest = match[2].trim()

    // Check for notes in parentheses
    const notesMatch = rest.match(/^(.+?)\s*\((.+)\)$/)
    if (notesMatch) {
      return {
        name: notesMatch[1].trim(),
        quantity,
        notes: notesMatch[2].trim(),
      }
    }

    return {
      name: rest,
      quantity,
      notes: '',
    }
  }

  // If no quantity found, check if it has parentheses for notes
  const notesMatch = line.match(/^(.+?)\s*\((.+)\)$/)
  if (notesMatch) {
    return {
      name: notesMatch[1].trim(),
      quantity: '',
      notes: notesMatch[2].trim(),
    }
  }

  // Otherwise, treat entire line as ingredient name
  return {
    name: line,
    quantity: '',
    notes: '',
  }
}
