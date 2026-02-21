"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ServiceFilter {
  id: string
  title: string
}

interface ServiceFilterProps {
  services: ServiceFilter[]
  onFilterChange: (serviceId: string | null) => void
  activeFilter: string | null
}

export function ServiceFilter({ services, onFilterChange, activeFilter }: ServiceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => onFilterChange(null)}
        variant={activeFilter === null ? "default" : "outline"}
        className="rounded-full"
      >
        All Services
      </Button>
      {services.map((service) => (
        <Button
          key={service.id}
          onClick={() => onFilterChange(service.id)}
          variant={activeFilter === service.id ? "default" : "outline"}
          className="rounded-full"
        >
          {service.title}
        </Button>
      ))}
    </div>
  )
}
