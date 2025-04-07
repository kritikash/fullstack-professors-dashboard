import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfessorService } from '../../services/professor.service';
import { ChartConfiguration } from 'chart.js';

// Angular Material and Common Modules
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatChipListbox } from '@angular/material/chips';


import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


import { MatInputModule } from '@angular/material/input';


import { EditProfileDialogComponent } from '../edit-profile-dialog.component';





// Interface to fix TS errors
interface Professor {
  _id: string; 
  name: string;
  h_index: number;
  total_citations: number;
  author_id: string;
  affiliations: string;
  citation_trends: {
    [year: string]: number;  
  };
  co_authors_network: {
    total_collaborators: number;
    top_collaborators: Collaborator[];
    
  };
  publication_breakdown?: {
    types?: Record<string, number>;
    languages?: Record<string, number>;
    open_access_distribution?: Record<string, number>;
  };
  publications: Publication[];
}
interface Collaborator {
  name: string;
  id: string;
  co_publications: number;
  co_citations: number;
  years: number[];
  rank: number;
}

export interface Publication {
  title: string;
  type: string;
  doi: string;
  publication_year: number;
  cited_by_count: number;
  authors: string[];
  journal: string;
  is_oa: boolean;
}





@Component({
  selector: 'app-professor-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatTabsModule,
    MatProgressBarModule,
    MatTableModule,
    NgFor,
    NgIf,
    MatChipsModule,
    MatIconModule,
    MatInputModule,

  ],
  templateUrl: './professor-detail.component.html',
  styleUrls: ['./professor-detail.component.css']
})
export class ProfessorDetailComponent implements OnInit {
  selectedProfessor: string = '';
  professor: Professor | null = null;
  professors: any[] = []; // Update to this if not already set
  citationChartLabels: string[] = [];
  collaborators: any[] = [];
  citations2023 = 0;
  citations2024 = 0;
  citations2025 = 0;
  percentChange: number = 0;
  searchQuery: string = '';


  
  publicationTypes: { label: string; count: number }[] = [];
  totalPublications = 0;

  // searchQuery: string = '';
  publications: any[] = []; // get this from backend
  // filteredPublications: any[] = [];



  citationChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Citations per Year',
        data: [],
        backgroundColor: '#007bff'
      }
    ]
  };
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  //metrics
  
  

getObjectEntries(obj: Record<string, number>): { key: string; value: number }[] {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}
  //collaborators: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private professorService: ProfessorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.professorService.getAllProfessors().subscribe({
      next: (data) => {
        console.log('Professors from API:', data);  // <--- ADD THIS
        this.professors = data;
        if (this.professors.length > 0) {
          this.selectedProfessor = this.professors[0].name;
          this.onProfessorChange();
          this.publications = this.professor?.publications || [];
          //this.filteredPublications = this.publications;

          

        }
      },
      error: (err) => console.error('Error loading professors:', err)
    });
  }
  
  types: Record<string, number> = {};
  languages: Record<string, number> = {};
  openAccess: Record<string, number> = {};

  onProfessorChange() {
    this.professor = this.professors.find(p => p.name === this.selectedProfessor);
  
    if (this.professor) {
      // Dynamically update citation chart
      const trends = this.professor.citation_trends || {};
      const years = Object.keys(trends).sort();
      this.citationChartData = {
        labels: years,
        datasets: [
          {
            label: 'Citations per Year',
            data: years.map(year => trends[year]),
            backgroundColor: '#007bff'
          }
        ]
      };
  
      // Update co-authors table
      this.collaborators = this.professor.co_authors_network?.top_collaborators || [];
  
      // You can update these values in the HTML template
      this.citations2023 = trends["2023"] || 0;
      this.citations2024 = trends["2024"] || 0;
      this.citations2025 = trends["2025"] || 0;
      this.percentChange = this.calculatePercentChange(this.citations2024, this.citations2025);

      if (this.professor.publication_breakdown) {
        const breakdown = this.professor.publication_breakdown;
        this.publicationTypes = Object.entries(breakdown).map(([key, value]) => ({
          label: key,
          count: typeof value === 'object' 
            ? Object.values(value as Record<string, number>).reduce((a, b) => a + b, 0)
            : value
        }));
        
        this.types = breakdown['types'] || {};
        this.languages = breakdown['languages'] || {};
        this.openAccess = breakdown['open_access_distribution'] || {};

  this.totalPublications = Object.values(this.types).reduce((acc, val) => acc + val, 0);
        this.publicationTypes = [];
        this.totalPublications = 0;
      }

      const breakdown = this.professor?.publication_breakdown;


      if (breakdown) {
        this.types = typeof breakdown['types'] === 'object' ? breakdown['types'] as Record<string, number> : {};
        this.languages = typeof breakdown['languages'] === 'object' ? breakdown['languages'] as Record<string, number> : {};
        this.openAccess = typeof breakdown['open_access_distribution'] === 'object' ? breakdown['open_access_distribution'] as Record<string, number> : {};
      }

      
      const trend = this.professor?.citation_trends;
      if (trend) {
        this.citations2023 = trend["2023"] || 0;
        this.citations2024 = trend["2024"] || 0;
        this.citations2025 = trend["2025"] || 0;
      }
      
    }
    if (this.professor?.publication_breakdown?.['types'] && typeof this.professor.publication_breakdown['types'] === 'object') {
      this.types = this.professor.publication_breakdown['types'] as Record<string, number>;
    } else {
      this.types = {};
    }

    
    
  }
  
  
  
  displayedColumns: string[] = ['name', 'co_publications', 'co_citations', 'years', 'rank'];
  // collaborators = [
  //   {
  //     name: 'Jørgen Skibsted',
  //     profile: 'https://example.com',
  //     co_publications: 4,
  //     co_citations: 316,
  //     years: [2014, 2015, 2019],
  //     rank: 12.3
  //   }
  // ];

  openEditProfileDialog() {
    if (!this.professor) return;
  
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '600px',
      data: {
        name: this.professor.name,
        affiliations: this.professor.affiliations
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.professor) {
          this.professor.name = result.name;
  this.professor.affiliations = result.affiliations;

  this.professorService.updateProfessor(this.professor._id, {
    name: result.name,
    affiliations: result.affiliations
  }).subscribe({
    next: () => console.log('Profile updated!'),
    error: (err) => console.error('Update failed:', err)
  });
        }
        
        // You can call update API here if needed
      }
    });
  }

  // Utility to calculate total publications from types object
  


getTotalPublications(types: Record<string, number>): number {
  return Object.values(types).reduce((sum, count) => sum + count, 0);
}


// filterPublications(): any[] {
//   const query = this.searchQuery.toLowerCase();
//   return this.publications.filter(pub =>
//     pub.title?.toLowerCase().includes(query) ||
//     pub.authors?.join(', ').toLowerCase().includes(query) ||
//     pub.journal?.toLowerCase().includes(query)
//   );
// }
getInitials(name: string): string {
  const words = name.split(' ');
  return words.map(w => w[0]).join('').toUpperCase().slice(0, 3);
}
collaborationFrequency = [
  { year: 2025, count: 8 },
  { year: 2024, count: 26 },
  { year: 2023, count: 8 },
  { year: 2022, count: 15 },
  { year: 2021, count: 3 },
  { year: 2020, count: 0 },
  { year: 2019, count: 4 },
  { year: 2018, count: 5 },
  { year: 2017, count: 1 },
];

formatOAKey(key: string | null | undefined): string {
  if (!key || key.toLowerCase() === 'null') {
    return 'Unknown';
  }
  return key;
}

calculatePercentChange(prev: number, current: number): number {
  if (prev === 0) return 0;
  const change = ((current - prev) / prev) * 100;
  return Math.abs(Math.round(change * 10) / 10); // rounded to 1 decimal
}
get filteredPublications() {
  if (!this.searchQuery?.trim()) return this.publications;

  const query = this.searchQuery.toLowerCase();
  return this.publications.filter(pub =>
    pub.title.toLowerCase().includes(query) ||
    pub.authors?.some((author: string) => author.toLowerCase().includes(query))
  );
}





  
  
  
}
