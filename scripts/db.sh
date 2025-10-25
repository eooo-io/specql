#!/bin/bash

# Database management script for specql development
# Provides easy commands to start, stop, and manage database containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Help function
show_help() {
    cat << EOF
Database Management Script for specql

Usage: npm run db:<command> [database]
   or: ./scripts/db.sh <command> [database]

Commands:
  start [db]     Start database container(s)
                 Databases: postgres, mysql, mssql, sqlite, all
                 Default: all

  stop [db]      Stop database container(s)
                 Databases: postgres, mysql, mssql, sqlite, all
                 Default: all

  restart [db]   Restart database container(s)

  logs [db]      View logs for database container
                 Default: all

  ps             Show status of all database containers

  clean          Stop and remove all containers and volumes
                 WARNING: This will delete all data!

  tools          Start database management tools (pgAdmin, phpMyAdmin)

  connect <db>   Connect to database CLI
                 Databases: postgres, mysql, mssql

  health [db]    Check health status of database(s)

Examples:
  npm run db:start postgres    Start PostgreSQL
  npm run db:stop all          Stop all databases
  npm run db:logs mysql        View MySQL logs
  npm run db:connect postgres  Connect to PostgreSQL CLI

EOF
}

# Start database(s)
start_db() {
    local db=${1:-all}

    case $db in
        postgres)
            print_info "Starting PostgreSQL..."
            docker-compose up -d postgres
            print_success "PostgreSQL started on port 5432"
            ;;
        mysql)
            print_info "Starting MySQL..."
            docker-compose up -d mysql
            print_success "MySQL started on port 3306"
            ;;
        mssql)
            print_info "Starting Microsoft SQL Server..."
            docker-compose up -d mssql
            print_success "MSSQL started on port 1433"
            ;;
        sqlite)
            print_info "Starting SQLite container..."
            docker-compose up -d sqlite
            print_success "SQLite container started (file-based)"
            ;;
        all)
            print_info "Starting all databases..."
            docker-compose up -d postgres mysql mssql sqlite
            print_success "All databases started"
            echo ""
            echo "Database Ports:"
            echo "  PostgreSQL: localhost:5432"
            echo "  MySQL:      localhost:3306"
            echo "  MSSQL:      localhost:1433"
            echo "  SQLite:     Container file system"
            ;;
        *)
            print_error "Unknown database: $db"
            echo "Available: postgres, mysql, mssql, sqlite, all"
            exit 1
            ;;
    esac
}

# Stop database(s)
stop_db() {
    local db=${1:-all}

    case $db in
        postgres|mysql|mssql|sqlite)
            print_info "Stopping $db..."
            docker-compose stop $db
            print_success "$db stopped"
            ;;
        all)
            print_info "Stopping all databases..."
            docker-compose stop postgres mysql mssql sqlite
            print_success "All databases stopped"
            ;;
        *)
            print_error "Unknown database: $db"
            exit 1
            ;;
    esac
}

# Restart database(s)
restart_db() {
    local db=${1:-all}
    stop_db "$db"
    sleep 2
    start_db "$db"
}

# View logs
show_logs() {
    local db=${1:-all}

    if [ "$db" = "all" ]; then
        docker-compose logs -f postgres mysql mssql sqlite
    else
        docker-compose logs -f "$db"
    fi
}

# Show container status
show_status() {
    print_info "Database container status:"
    docker-compose ps postgres mysql mssql sqlite
}

# Clean everything
clean_all() {
    print_warning "This will remove all containers and volumes!"
    read -p "Are you sure? (yes/no): " -r
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Stopping containers..."
        docker-compose down -v
        print_success "All containers and volumes removed"
    else
        print_info "Cancelled"
    fi
}

# Start management tools
start_tools() {
    print_info "Starting database management tools..."
    docker-compose --profile tools up -d pgadmin phpmyadmin
    print_success "Tools started:"
    echo "  pgAdmin:     http://localhost:5050 (admin@specql.local / admin)"
    echo "  phpMyAdmin:  http://localhost:8080"
}

# Connect to database CLI
connect_db() {
    local db=$1

    if [ -z "$db" ]; then
        print_error "Please specify a database: postgres, mysql, or mssql"
        exit 1
    fi

    case $db in
        postgres)
            print_info "Connecting to PostgreSQL..."
            docker-compose exec postgres psql -U specql -d specql_dev
            ;;
        mysql)
            print_info "Connecting to MySQL..."
            docker-compose exec mysql mysql -u specql -pspecql_dev_password specql_dev
            ;;
        mssql)
            print_info "Connecting to MSSQL..."
            docker-compose exec mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'SpecQL_Dev_Pass123!' -d specql_dev
            ;;
        *)
            print_error "Unknown database: $db"
            echo "Available: postgres, mysql, mssql"
            exit 1
            ;;
    esac
}

# Check health
check_health() {
    local db=${1:-all}

    print_info "Checking database health..."

    if [ "$db" = "all" ] || [ "$db" = "postgres" ]; then
        if docker-compose exec -T postgres pg_isready -U specql &> /dev/null; then
            print_success "PostgreSQL is healthy"
        else
            print_error "PostgreSQL is not healthy"
        fi
    fi

    if [ "$db" = "all" ] || [ "$db" = "mysql" ]; then
        if docker-compose exec -T mysql mysqladmin ping -h localhost -u specql -pspecql_dev_password &> /dev/null; then
            print_success "MySQL is healthy"
        else
            print_error "MySQL is not healthy"
        fi
    fi

    if [ "$db" = "all" ] || [ "$db" = "mssql" ]; then
        if docker-compose exec -T mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'SpecQL_Dev_Pass123!' -Q 'SELECT 1' &> /dev/null; then
            print_success "MSSQL is healthy"
        else
            print_error "MSSQL is not healthy"
        fi
    fi
}

# Main command handler
case ${1:-help} in
    start)
        start_db "${2:-all}"
        ;;
    stop)
        stop_db "${2:-all}"
        ;;
    restart)
        restart_db "${2:-all}"
        ;;
    logs)
        show_logs "${2:-all}"
        ;;
    ps|status)
        show_status
        ;;
    clean)
        clean_all
        ;;
    tools)
        start_tools
        ;;
    connect)
        connect_db "$2"
        ;;
    health)
        check_health "${2:-all}"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
