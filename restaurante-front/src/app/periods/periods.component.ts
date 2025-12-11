import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriodsService } from '../services/periods.service';

@Component({
  selector: 'app-periods',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.css']
})
export class PeriodsComponent implements OnInit {

  periods: any[] = [];
  loading = false;
  dataLoaded = false;
  error: string = '';

  // Filtros
  cdn_restaurant_name = '';
  restaurant_name = '';
  status_name = 'all';

  dateFilter = 'all';
  customStart = '';
  customEnd = '';

  constructor(
    private periodsService: PeriodsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // No cargamos datos automáticamente
  }

  loadPeriods(initial = false) {
    this.loading = true;
    this.dataLoaded = true;
    this.error = '';
    this.cdr.markForCheck();

    // Si es carga inicial → enviar SIN filtros
    const filters = initial ? {} : {
      cdn_restaurant_name: this.cdn_restaurant_name,
      restaurant_name: this.restaurant_name,
      status_name: this.status_name,
      dateFilter: this.dateFilter,
      start: this.customStart,
      end: this.customEnd,
    };

    console.log('Enviando filtros:', filters);

    this.periodsService.getPeriods(filters).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.periods = [...data]; // Crear nueva referencia
        this.loading = false;
        this.cdr.markForCheck(); // Forzar detección de cambios
        console.log('Loading set to false, periods:', this.periods.length);
      },
      error: (err) => {
        console.error('Error al cargar períodos:', err);
        this.loading = false;
        this.error = `Error al conectar con el servidor: ${err.status} ${err.statusText}`;
        this.cdr.markForCheck();
      },
      complete: () => {
        console.log('Observable completado');
      }
    });
  }

  clearFilters() {
    this.cdn_restaurant_name = '';
    this.restaurant_name = '';
    this.status_name = 'all';
    this.dateFilter = 'all';
    this.customStart = '';
    this.customEnd = '';

    this.loadPeriods(true);
  }

  formatDate(date: any) {
    if (!date) return 'Aún abierto';

    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
