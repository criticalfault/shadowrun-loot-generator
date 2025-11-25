import { useState, useEffect } from 'react'
import './App.css'
import LootListSelector from './components/LootListSelector'
import RollButton from './components/RollButton'
import ResultsList from './components/ResultsList'
import { rollDice } from './utils/diceRoller'
import { exportToText } from './utils/fileExporter'
import lootListsData from './data/lootLists.json'

// Fallback data in case JSON loading fails
const fallbackLootLists = [
  {
    id: 'weapons',
    name: 'Weapons',
    items: [
      { name: 'Pistol', quantityFormula: '1d4', valueFormula: '1d6x50' },
      { name: 'Assault Rifle', quantityFormula: '1d2', valueFormula: '2d6x100' }
    ]
  }
]

function App() {
  const [lootLists, setLootLists] = useState([])
  const [selectedLists, setSelectedLists] = useState(['goonpockets'])
  const [results, setResults] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  // Load loot lists from JSON data file with error handling
  useEffect(() => {
    try {
      if (lootListsData && Array.isArray(lootListsData) && lootListsData.length > 0) {
        setLootLists(lootListsData)
      } else {
        console.warn('Invalid loot lists data, using fallback')
        setLootLists(fallbackLootLists)
        setErrorMessage('Using default loot lists. Custom data could not be loaded.')
      }
    } catch (error) {
      console.error('Error loading loot lists:', error)
      setLootLists(fallbackLootLists)
      setErrorMessage('Error loading loot lists. Using default data.')
    }
  }, [])

  // Handle list selection toggle
  const handleListSelection = (listId) => {
    setSelectedLists(prev => {
      if (prev.includes(listId)) {
        return prev.filter(id => id !== listId)
      } else {
        return [...prev, listId]
      }
    })
  }

  // Handle pull operation with error handling
  const handlePull = (rollCount = 1) => {
    // Clear any previous error messages
    setErrorMessage(null)

    if (selectedLists.length === 0) {
      setErrorMessage('Please select at least one loot list.')
      return
    }

    const newResults = []

    try {
      for (let roll = 0; roll < rollCount; roll++) {
        // Randomly select one list from selected lists
        const randomListId = selectedLists[Math.floor(Math.random() * selectedLists.length)]
        const selectedList = lootLists.find(list => list.id === randomListId)

        if (!selectedList) {
          setErrorMessage('Selected list not found. Please try again.')
          return
        }

        if (!selectedList.items || selectedList.items.length === 0) {
          setErrorMessage(`The "${selectedList.name}" list has no items.`)
          return
        }

        // Randomly select one item from the list
        const randomItem = selectedList.items[Math.floor(Math.random() * selectedList.items.length)]

        if (!randomItem || !randomItem.name || !randomItem.quantityFormula || !randomItem.valueFormula) {
          setErrorMessage('Invalid item data. Please check your loot list configuration.')
          return
        }

        // Roll quantity using dice roller utility with error handling
        let quantity
        try {
          quantity = rollDice(randomItem.quantityFormula)
          if (quantity < 1 || quantity > 1000) {
            throw new Error('Quantity out of reasonable range')
          }
        } catch (error) {
          setErrorMessage(`Error rolling quantity for "${randomItem.name}": ${error.message}`)
          return
        }

        // Roll value for each item instance with error handling
        const values = []
        try {
          for (let i = 0; i < quantity; i++) {
            const value = rollDice(randomItem.valueFormula)
            values.push(value)
          }
        } catch (error) {
          setErrorMessage(`Error rolling value for "${randomItem.name}": ${error.message}`)
          return
        }

        // Create result entry object with unique ID and timestamp
        const resultEntry = {
          id: `result_${Date.now()}_${roll}_${Math.random().toString(36).substring(2, 11)}`,
          itemName: randomItem.name,
          listName: selectedList.name,
          quantity: quantity,
          values: values,
          timestamp: Date.now() + roll
        }

        newResults.push(resultEntry)
      }

      // Add all results to results array
      setResults(prev => [...prev, ...newResults])
    } catch (error) {
      console.error('Unexpected error during pull operation:', error)
      setErrorMessage(`An unexpected error occurred: ${error.message}`)
    }
  }

  // Handle reordering of result entries
  const handleReorder = (index, direction) => {
    const newResults = [...results]
    
    if (direction === 'up' && index > 0) {
      // Swap with previous element
      [newResults[index - 1], newResults[index]] = [newResults[index], newResults[index - 1]]
    } else if (direction === 'down' && index < results.length - 1) {
      // Swap with next element
      [newResults[index], newResults[index + 1]] = [newResults[index + 1], newResults[index]]
    } else {
      // No change needed
      return
    }
    
    // Update display immediately after reorder
    setResults(newResults)
  }

  // Handle deletion of result entry
  const handleDelete = (index) => {
    // Remove result by index
    const newResults = results.filter((_, i) => i !== index)
    
    // Update display immediately after delete
    setResults(newResults)
  }

  // Handle export to text file with error handling
  const handleExport = () => {
    setErrorMessage(null)

    if (results.length === 0) {
      setErrorMessage('No results to export. Generate some loot first!')
      return
    }

    try {
      exportToText(results)
    } catch (error) {
      console.error('Error exporting results:', error)
      setErrorMessage(`Failed to export results: ${error.message}`)
    }
  }

  // Handle clearing all results
  const handleClear = () => {
    setResults([])
  }

  // Dismiss error message
  const dismissError = () => {
    setErrorMessage(null)
  }

  return (
    <div className="container my-5">
      <div>Love this utility? We have more! Checkout <a href='https://www.nullsheen.com' target='_blank'>NullSheen.com</a></div>
      {/* Main Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-2">Shadowrun Loot Generator</h1>
        <p className="text-muted">Generate random loot for your Shadowrun campaigns</p>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMessage}
          <button type="button" className="btn-close" onClick={dismissError} aria-label="Close"></button>
        </div>
      )}

      {/* Loot Generation Section */}
      <section className="mb-5">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">Generate Loot</h3>
            
            {/* Loot List Selector */}
            <div className="mb-4">
              <LootListSelector
                lootLists={lootLists}
                selectedLists={selectedLists}
                onSelectionChange={handleListSelection}
              />
            </div>

            {/* Roll Button */}
            <div className="mb-3">
              <RollButton
                onRoll={handlePull}
                disabled={selectedLists.length === 0}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">Results</h3>
            <ResultsList
              results={results}
              onReorder={handleReorder}
              onDelete={handleDelete}
              onExport={handleExport}
              onClear={handleClear}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
