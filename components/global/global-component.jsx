'use client';

import { useEffect, useState } from 'react';

export default function GlobalComponent({ data }) {
    const [components, setComponents] = useState({});

    useEffect(() => {
        // Dynamically load components based on `__component` names
        const loadComponents = async () => {
            const componentMap = {};

            // Loop through each component in the data
            for (const component of data.components) {
                const componentName = component.__component.split('.')[1]; // Get the part after "shared."
                const pascalCaseName = convertToPascalCase(componentName);

                // Dynamically import component
                try {
                    const { default: DynamicComponent } = await import(`../${pascalCaseName}`);
                    componentMap[pascalCaseName] = DynamicComponent;
                } catch (err) {
                    console.error(`Error loading component ${pascalCaseName}:`, err);
                }
            }

            setComponents(componentMap);
        };

        loadComponents();
    }, [data.components]);

    // Convert component name to PascalCase
    const convertToPascalCase = (str) => {
        return str
            .replace(/(^[a-z])|(-[a-z])/g, (match) => match.toUpperCase())
            .replace(/-/g, ''); // Remove the hyphens
    };

    // Render the component dynamically based on the data
    const renderComponent = (component, index) => {
        const componentName = component.__component.split('.')[1]; // Get part after "shared."
        const pascalCase = convertToPascalCase(componentName);
        const DynamicComponent = components[pascalCase];
        if (!DynamicComponent) return null;

        return <DynamicComponent key={index} {...component} />;
    };

    return (
        <div className="global-component">
            {data.components.map((component, index) => renderComponent(component, index))}
        </div>
    );
}

