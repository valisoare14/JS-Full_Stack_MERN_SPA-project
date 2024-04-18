function usNumberFormat(number) {
    return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(number)
}

export {usNumberFormat}